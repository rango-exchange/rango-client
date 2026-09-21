import type { Failure, Transition } from './transitions';
import type {
  SwapExecution,
  SwapExecutionStep,
  SwapFailure,
  SwapFailurePhase,
} from './types';
import type { TransactionPrerequisiteResult } from 'rango-types';

/** The phase a host sees for a failure, by the action it happened in. */
const FAILURE_PHASES: Record<Failure['phase'], SwapFailurePhase> = {
  create_transaction: 'build',
  run_prerequisites: 'prerequisite',
  execute_transaction: 'sign',
  find_transaction_hash: 'track',
  check_status: 'track',
  cancel: 'cancel',
};

/** What a step forgets when it gets a transaction that has not been sent. */
const NOT_SENT = {
  hash: null,
  signRequestedAt: null,
  submittedAt: null,
};

/**
 * Applies one transition to the record and returns the new record. It is
 * pure: the input is never touched, `version` goes up by one on every call,
 * and `now` is the only clock, so replaying a list of transitions always
 * gives the same record.
 */
export function reduce(
  exec: SwapExecution,
  transition: Transition,
  now: number = Date.now()
): SwapExecution {
  return { ...apply(exec, transition, now), version: exec.version + 1 };
}

function apply(
  exec: SwapExecution,
  transition: Transition,
  now: number
): SwapExecution {
  switch (transition.type) {
    case 'started':
      return exec;

    case 'step_started':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        status: 'running',
        blocked: null,
      }));

    case 'tx_built':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        ...NOT_SENT,
        tx: transition.tx,
      }));

    case 'prerequisite_updated':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        prerequisiteResults: upsertResult(
          step.prerequisiteResults,
          transition.result
        ),
      }));

    case 'sign_requested':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        signRequestedAt: now,
      }));

    case 'tx_submitted':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        submittedAt: now,
      }));

    case 'tx_sent':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        hash: transition.hash,
        signRequestedAt: null,
        explorerUrls: transition.explorerUrl
          ? [
              ...step.explorerUrls,
              { url: transition.explorerUrl, description: 'Swap' },
            ]
          : step.explorerUrls,
      }));

    case 'tx_replaced':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        hash: transition.hash,
        explorerUrls: transition.explorerUrl
          ? [
              ...step.explorerUrls.slice(0, -1),
              { url: transition.explorerUrl, description: 'Replaced Swap' },
            ]
          : step.explorerUrls,
      }));

    // A `null` field means the API said nothing new about it; what was known stays.
    case 'tracking':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        outputAmount: transition.outputAmount ?? step.outputAmount,
        internalSteps: transition.internalSteps ?? step.internalSteps,
        diagnosisUrl: transition.diagnosisUrl ?? step.diagnosisUrl,
        explorerUrls: transition.explorerUrls ?? step.explorerUrls,
        statusMessage: transition.statusMessage ?? step.statusMessage,
      }));

    case 'tx_renewed':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        ...NOT_SENT,
        tx: transition.tx,
      }));

    case 'step_succeeded':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        status: 'success',
        outputAmount: transition.outputAmount,
      }));

    // A blocked step never reached the wallet, so any sign request on record is void.
    case 'blocked':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        blocked: transition.block,
        signRequestedAt: null,
      }));

    case 'unblocked':
      return withStep(exec, transition.stepIndex, (step) => ({
        ...step,
        blocked: null,
      }));

    case 'failed': {
      const { failure } = transition;
      // A swap cancelled with no step left to run has none to mark.
      const failed =
        failure.stepIndex === null
          ? exec
          : withStep(exec, failure.stepIndex, (step) => ({
              ...step,
              status: 'failed',
            }));
      return {
        ...failed,
        status: 'failed',
        failure: toSwapFailure(failure),
        finishedAt: now,
      };
    }

    case 'succeeded':
      return { ...exec, status: 'success', finishedAt: now };
  }
}

/** The record with one step replaced; unchanged when there is no such step. */
function withStep(
  exec: SwapExecution,
  stepIndex: number,
  update: (step: SwapExecutionStep) => SwapExecutionStep
): SwapExecution {
  const step = exec.steps[stepIndex];
  if (!step) {
    return exec;
  }
  const steps = exec.steps.slice();
  steps[stepIndex] = update(step);
  return { ...exec, steps };
}

/** Replaces the result for the same prerequisite, or adds it. */
function upsertResult(
  results: TransactionPrerequisiteResult[],
  result: TransactionPrerequisiteResult
): TransactionPrerequisiteResult[] {
  const index = results.findIndex(
    (current) =>
      current.prerequisiteIndex === result.prerequisiteIndex &&
      current.prerequisiteType === result.prerequisiteType
  );
  if (index === -1) {
    return [...results, result];
  }
  const next = results.slice();
  next[index] = result;
  return next;
}

function toSwapFailure(failure: Failure): SwapFailure {
  return {
    code: failure.code,
    phase: FAILURE_PHASES[failure.phase],
    stepIndex: failure.stepIndex,
    detail: failure.message ?? null,
    origin: failure.origin ?? 'client',
  };
}
