import type { ActionContext } from './context';
import type { Decision } from './decider/mod';
import type { WalletEvent } from './events';
import type { Transition } from './transitions';
import type { SwapExecution, SwapExecutionResult } from './types';
import type { RangoClient } from 'rango-sdk';

import { ActionError, RangoSdkError } from '../errors';
import { notifyListeners } from '../listeners';

import { checkStatus } from './actions/checkStatus';
import { createTransaction } from './actions/createTransaction';
import { executeTransaction } from './actions/executeTransaction/mod';
import { findTransactionHash } from './actions/findTransactionHash/mod';
import { runPrerequisite } from './actions/runPrerequisite/runPrerequisite';
import { isBlockedOnWallet, isSameBlock } from './blocks';
import { decide } from './decider/mod';
import { reduce } from './reducer';
import { type Store } from './store';

/** What listeners get on every committed transition: the transition and the record after it. */
export type EngineEvent = {
  requestId: string;
  transition: Transition;
  execution: SwapExecution;
};

export type EngineListener = (event: EngineEvent) => void;

export type CommitOptions = {
  /**
   * Write nothing, and answer `false`, when the record is no longer running.
   * The loop commits this way, so what an action comes back with after the
   * swap was cancelled is dropped instead of landing on a failed record.
   */
  onlyIfRunning?: boolean;
};

type PendingExecution = {
  resolve: (result: SwapExecutionResult) => void;
  reject: (error: RangoSdkError) => void;
};

/**
 * How long the loop waits before asking again, when an action reported
 * nothing new or could not reach what it polls.
 */
const POLL_INTERVAL = 5_000;

const TERMINAL_TRANSITIONS: Transition['type'][] = [
  'succeeded',
  'failed',
  'blocked',
];

/** What the loop's own commits pass: a stopped swap takes no more transitions. */
const WHILE_RUNNING: CommitOptions = { onlyIfRunning: true };

export class Engine {
  #httpClient: RangoClient;
  #store: Store;
  #context: ActionContext;
  #listeners = new Set<EngineListener>();
  /**
   * The callers waiting on `execute`, by request id. An entry is added when
   * `execute` is called and removed when a commit settles it, so an execution
   * resumed by `resume` after a reload has no entry and settles nothing.
   */
  #promiseRegistry: Map<string, PendingExecution> = new Map();
  /**
   * The executions whose loop is running right now. A wake-up for one of
   * them is dropped, so a wallet event fired by a network switch the loop
   * itself asked for cannot start a second loop next to it.
   */
  #active = new Set<string>();
  /**
   * The writes queued for each execution, while any is in flight. A commit
   * waits for those before it, so the loop and a `cancel` from the host
   * never read the same version and write over each other.
   */
  #queues = new Map<string, Promise<void>>();
  /** Whether the engine is in read-only mode; see `pause`. */
  #paused = false;

  constructor(params: {
    httpClient: RangoClient;
    store: Store;
    getProvider: ActionContext['getProvider'];
    getMeta: ActionContext['getMeta'];
  }) {
    const { httpClient, store, getProvider, getMeta } = params;
    this.#httpClient = httpClient;
    this.#context = { getProvider, getMeta };
    this.#store = store;
  }

  get isPaused(): boolean {
    return this.#paused;
  }

  async getRunningExecutions() {
    const executions = await this.#store.getAll();
    return executions.filter((exec) => exec.status === 'running');
  }

  /** Registers a listener for every committed transition and returns what removes it. */
  subscribe(listener: EngineListener): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  /**
   * Starts the execution and returns a promise that stays pending until a
   * commit sees it succeed or fail, however many times it blocks and resumes
   * in between. Refused while the engine is paused.
   */
  async execute(exec: SwapExecution): Promise<SwapExecutionResult> {
    if (this.#paused) {
      throw new RangoSdkError(
        'The engine is paused; call resume before starting a swap'
      );
    }

    const result = new Promise<SwapExecutionResult>((resolve, reject) => {
      this.#promiseRegistry.set(exec.requestId, { resolve, reject });
    });

    try {
      await this.#store.insert(exec);
      await this.commit(exec.requestId, { type: 'started' });
    } catch (error) {
      this.#promiseRegistry.delete(exec.requestId);
      throw error;
    }

    this.#continue(exec.requestId);
    return result;
  }

  /**
   * Puts the engine in read-only mode: no loop starts, `execute` is refused,
   * wallet events are ignored, and a loop that is running stops once the
   * action in flight has returned and its result is on record. Reads,
   * cancels and deletes keep working. For a host with several tabs on one
   * store, so that only the active one runs swaps.
   */
  pause(): void {
    this.#paused = true;
  }

  /**
   * Lets the engine run again and continues every execution that is still
   * running: those a paused loop left, and those found in the store after a
   * reload. A parked one checks its wallet again and parks again if nothing
   * changed. One whose loop is already running is left alone, so calling this
   * on every change of the host's active state is safe.
   */
  async resume(): Promise<void> {
    this.#paused = false;
    const runningExecutions = await this.getRunningExecutions();
    runningExecutions.forEach((exec) => {
      this.#continue(exec.requestId);
    });
  }

  /**
   * Tells the engine a wallet changed. Every execution parked on that wallet
   * runs again: its guard reads the wallet's live state, so it either goes on
   * to sign or parks again with the reason that now applies. An execution
   * whose loop is running is left alone. Ignored while the engine is paused.
   */
  async notify(event: WalletEvent) {
    if (this.#paused) {
      return;
    }
    const runningExecutions = await this.getRunningExecutions();
    runningExecutions
      .filter((exec) => isBlockedOnWallet(exec, event.walletType))
      .forEach((exec) => {
        this.#continue(exec.requestId);
      });
  }

  /**
   * Stops a running execution at the host's request. The record fails at
   * once with `USER_CANCEL` in the `cancel` phase, on the step that was
   * running or would have run next, and the caller waiting on `execute` is
   * rejected. A loop running the execution exits on its next turn, and what
   * its action in flight comes back with is dropped. A prompt the wallet has
   * already opened cannot be withdrawn: a transaction the user still signs
   * is sent, but never recorded. An execution that is not running is left
   * as it is.
   */
  async cancel(requestId: string): Promise<void> {
    await this.#serialize(requestId, async () => {
      const exec = await this.#store.get(requestId);
      if (exec.status !== 'running') {
        return;
      }
      const stepIndex = exec.steps.findIndex(
        (step) => step.status !== 'success'
      );
      await this.#apply(exec, {
        type: 'failed',
        failure: {
          code: 'USER_CANCEL',
          phase: 'cancel',
          stepIndex: stepIndex === -1 ? null : stepIndex,
        },
      });
    });
  }

  /**
   * Applies a transition to the stored record, persists the result, tells the
   * listeners, and settles the `execute` promise when the swap is over.
   * Commits to one execution run one at a time, in the order they were asked
   * for. Returns whether the transition was written, which it is not only
   * when `onlyIfRunning` is set and the swap has stopped.
   */
  async commit(
    requestId: string,
    transition: Transition,
    options: CommitOptions = {}
  ): Promise<boolean> {
    return this.#serialize(requestId, async () => {
      const exec = await this.#store.get(requestId);
      if (options.onlyIfRunning && exec.status !== 'running') {
        return false;
      }
      await this.#apply(exec, transition);
      return true;
    });
  }

  /**
   * The loop of one execution: turn after turn until the swap is finished or
   * parked. Only one loop runs per execution; a second call while one is
   * running returns at once.
   */
  async run(requestId: string) {
    if (this.#active.has(requestId)) {
      return;
    }
    this.#active.add(requestId);
    try {
      while (await this.#turn(requestId)) {
        // The record has more to do.
      }
    } finally {
      this.#active.delete(requestId);
    }
  }

  /**
   * One turn: decide what the record needs, run it, and commit what came
   * back in order. Returns whether there is a next turn, which there is not
   * once the swap is finished, parked, cancelled under the action, or the
   * engine was paused, in which case the action's result is on record. The
   * loop commits `step_started` when it picks up a step; `sign_requested` is
   * committed by the executor through a hook, right before the wallet is
   * asked, so it never lands before the guard in front of signing. An action
   * that returned nothing, or threw because it could not reach what it
   * polls, is asked again after `POLL_INTERVAL`.
   */
  async #turn(requestId: string): Promise<boolean> {
    if (this.#paused) {
      return false;
    }

    let exec = await this.#store.get(requestId);
    const decision = decide(exec);

    let transitions: Transition[];

    if (decision.kind === 'no_action') {
      return false;
    } else if (decision.kind === 'succeed') {
      await this.commit(requestId, { type: 'succeeded' }, WHILE_RUNNING);
      return false;
    } else if (decision.kind === 'blocked') {
      transitions = [
        {
          type: 'blocked',
          stepIndex: decision.stepIndex,
          block: decision.block,
        },
      ];
    } else if (decision.kind === 'fail') {
      transitions = [
        {
          type: 'failed',
          failure: {
            code: decision.code,
            phase: decision.phase,
            stepIndex: decision.stepIndex,
            message: decision.message,
          },
        },
      ];
    } else {
      const { stepIndex } = decision;
      if (exec.steps[stepIndex]?.status === 'pending') {
        const started = await this.commit(
          requestId,
          { type: 'step_started', stepIndex },
          WHILE_RUNNING
        );
        if (!started) {
          return false;
        }
        exec = await this.#store.get(requestId);
      }

      try {
        transitions = await this.#runAction(exec, decision);
      } catch {
        await delay(POLL_INTERVAL);
        return true;
      }
    }

    // A wake that finds the step parked as before has nothing new to record.
    if (isRepeatedBlock(exec, transitions)) {
      return false;
    }

    for (const transition of transitions) {
      const applied = await this.commit(requestId, transition, WHILE_RUNNING);
      // The swap was stopped while the action ran; the rest is void.
      if (!applied) {
        return false;
      }
    }

    const last = transitions[transitions.length - 1];
    if (last && TERMINAL_TRANSITIONS.includes(last.type)) {
      return false;
    }
    if (transitions.length === 0) {
      await delay(POLL_INTERVAL);
    }
    return true;
  }

  async #runAction(
    exec: SwapExecution,
    decision: Extract<Decision, { kind: 'run_action' }>
  ): Promise<Transition[]> {
    const { stepIndex, action } = decision;

    switch (action.type) {
      case 'create_transaction':
        return createTransaction(exec, {
          httpClient: this.#httpClient,
          stepIndex,
        });
      case 'run_prerequisite':
        return runPrerequisite(exec, this.#context, {
          stepIndex,
          prerequisiteIndex: action.prerequisiteIndex,
        });
      case 'execute_transaction':
        return executeTransaction(exec, this.#context, {
          stepIndex,
          beforeSign: async () => {
            await this.#recordSignRequest(exec, stepIndex);
          },
        });
      case 'find_transaction_hash':
        return findTransactionHash(exec, { stepIndex });
      case 'check_status':
        return checkStatus(exec, { stepIndex, httpClient: this.#httpClient });
    }
  }

  /**
   * Puts `sign_requested` on record right before the wallet is asked, after
   * `unblocked` when the step was parked: being asked to sign means the
   * guard passed. A swap cancelled in the meantime takes neither, and the
   * executor is stopped before it opens the prompt; the failure it turns
   * that into is dropped like anything else it would have returned.
   */
  async #recordSignRequest(
    exec: SwapExecution,
    stepIndex: number
  ): Promise<void> {
    const transitions: Transition[] = exec.steps[stepIndex]?.blocked
      ? [
          { type: 'unblocked', stepIndex },
          { type: 'sign_requested', stepIndex },
        ]
      : [{ type: 'sign_requested', stepIndex }];

    for (const transition of transitions) {
      const applied = await this.commit(
        exec.requestId,
        transition,
        WHILE_RUNNING
      );
      if (!applied) {
        throw new ActionError(
          'USER_CANCEL',
          'The swap was cancelled before the wallet was asked to sign'
        );
      }
    }
  }

  /**
   * Writes the record after the transition, tells the listeners, and settles
   * the caller waiting on `execute` when the swap is over. Only ever runs
   * under the execution's queue, so the record it was given is current.
   */
  async #apply(exec: SwapExecution, transition: Transition): Promise<void> {
    const { requestId } = exec;
    const next = reduce(exec, transition);
    await this.#store.update(next);

    notifyListeners(this.#listeners, {
      requestId,
      transition,
      execution: next,
    });

    if (transition.type === 'succeeded') {
      const hash = next.steps[next.steps.length - 1]?.hash;

      if (hash) {
        this.#settle(requestId, (pending) => pending.resolve({ hash }));
      } else {
        this.#settle(requestId, (pending) =>
          pending.reject(
            new RangoSdkError('Execution succeeded without a transaction hash')
          )
        );
      }
    } else if (transition.type === 'failed') {
      this.#settle(requestId, (pending) =>
        pending.reject(
          new RangoSdkError('Execution failed', transition.failure)
        )
      );
    }
  }

  /**
   * Runs `task` once every task queued before it for this execution is done,
   * whatever came of them, and returns what it returns.
   */
  async #serialize<T>(requestId: string, task: () => Promise<T>): Promise<T> {
    const previous = this.#queues.get(requestId) ?? Promise.resolve();
    const current = previous.then(task);
    const settled = current.then(noop, noop);
    this.#queues.set(requestId, settled);
    try {
      return await current;
    } finally {
      if (this.#queues.get(requestId) === settled) {
        this.#queues.delete(requestId);
      }
    }
  }

  /**
   * Runs the loop without waiting for it. A loop that throws, for example on
   * a refused store write, stops and rejects the caller waiting on `execute`,
   * if there is one.
   */
  #continue(requestId: string) {
    this.run(requestId).catch((error: unknown) => {
      this.#settle(requestId, (pending) =>
        pending.reject(
          new RangoSdkError('The execution loop stopped unexpectedly', error)
        )
      );
    });
  }

  /** Settles the promise `execute` returned for this request, if any, and forgets it. */
  #settle(requestId: string, settle: (pending: PendingExecution) => void) {
    const pending = this.#promiseRegistry.get(requestId);
    if (!pending) {
      return;
    }
    this.#promiseRegistry.delete(requestId);
    settle(pending);
  }
}

/** Whether the action only parked the step again for the reason already on record. */
function isRepeatedBlock(
  exec: SwapExecution,
  transitions: Transition[]
): boolean {
  const [transition] = transitions;
  return (
    transitions.length === 1 &&
    transition.type === 'blocked' &&
    isSameBlock(
      exec.steps[transition.stepIndex]?.blocked ?? null,
      transition.block
    )
  );
}

async function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function noop(): void {
  // Marks a queued write as settled, whatever came of it.
}
