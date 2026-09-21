import type { Transition } from '../../src/execution/transitions';
import type { SwapExecution } from '../../src/execution/types';

import {
  SignerErrorCode,
  TransactionType,
  XRPL_CHANGE_TRUSTLINE_TYPE,
} from 'rango-types';
import { describe, expect, it } from 'vitest';

import { reduce } from '../../src/execution/reducer';

import { execution, transaction } from './fakes';

const NOW = 1_700_000_000_000;

const swapTx = transaction([], {
  type: TransactionType.EVM,
  blockChain: 'ARBITRUM',
});

/** Applies the transitions in order, each at `NOW`. */
function replay(exec: SwapExecution, transitions: Transition[]): SwapExecution {
  return transitions.reduce(
    (current, transition) => reduce(current, transition, NOW),
    exec
  );
}

describe('reduce', () => {
  it('returns a new record one version up and leaves the input alone', () => {
    const exec = execution(null);
    const snapshot = structuredClone(exec);

    const next = reduce(exec, { type: 'step_started', stepIndex: 0 }, NOW);

    expect(next).not.toBe(exec);
    expect(next.version).toBe(exec.version + 1);
    expect(exec).toEqual(snapshot);
  });

  it('bumps the version on started even though nothing else changes', () => {
    const exec = execution(null);

    const next = reduce(exec, { type: 'started' }, NOW);

    expect(next).toEqual({ ...exec, version: exec.version + 1 });
  });

  it('ignores a step index the record does not have', () => {
    const exec = execution(null);

    const next = reduce(exec, { type: 'step_started', stepIndex: 5 }, NOW);

    expect(next.steps).toEqual(exec.steps);
  });

  it('marks a picked-up step running and clears its block', () => {
    const exec = execution(null, [], {
      blocked: { reason: 'wallet_disconnected', walletType: 'metamask' },
    });

    const next = reduce(exec, { type: 'step_started', stepIndex: 0 }, NOW);

    expect(next.steps[0]).toMatchObject({ status: 'running', blocked: null });
  });

  it('stores a built transaction and forgets any earlier send', () => {
    const exec = execution(null, [], {
      hash: 'OLD',
      signRequestedAt: 1,
      submittedAt: 2,
    });

    const next = reduce(
      exec,
      { type: 'tx_built', stepIndex: 0, tx: swapTx },
      NOW
    );

    expect(next.steps[0]).toMatchObject({
      tx: swapTx,
      hash: null,
      signRequestedAt: null,
      submittedAt: null,
    });
  });

  it('upserts prerequisite results by index and type', () => {
    const pending = {
      prerequisiteIndex: 0,
      prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
      status: 'pending',
      data: { executedTransactionHash: 'H' },
    } as const;
    const other = { ...pending, prerequisiteIndex: 1 };

    const next = replay(execution(swapTx), [
      { type: 'prerequisite_updated', stepIndex: 0, result: pending },
      { type: 'prerequisite_updated', stepIndex: 0, result: other },
      {
        type: 'prerequisite_updated',
        stepIndex: 0,
        result: { ...pending, status: 'success' },
      },
    ]);

    expect(next.steps[0].prerequisiteResults).toEqual([
      { ...pending, status: 'success' },
      other,
    ]);
  });

  it('records when signing was requested and when the transaction was submitted', () => {
    const next = replay(execution(swapTx), [
      { type: 'sign_requested', stepIndex: 0 },
      { type: 'tx_submitted', stepIndex: 0 },
    ]);

    expect(next.steps[0]).toMatchObject({
      signRequestedAt: NOW,
      submittedAt: NOW,
    });
  });

  it('records the sent hash, clears the sign request, and adds the explorer link', () => {
    const exec = execution(swapTx, [], { signRequestedAt: 1 });

    const next = reduce(
      exec,
      {
        type: 'tx_sent',
        stepIndex: 0,
        hash: 'TXHASH',
        explorerUrl: 'https://scan/1',
      },
      NOW
    );

    expect(next.steps[0]).toMatchObject({
      hash: 'TXHASH',
      signRequestedAt: null,
      explorerUrls: [{ url: 'https://scan/1', description: 'Swap' }],
    });
  });

  it('adds no explorer link without a url', () => {
    const withoutLink = reduce(
      execution(swapTx),
      { type: 'tx_sent', stepIndex: 0, hash: 'A', explorerUrl: null },
      NOW
    );

    expect(withoutLink.steps[0].explorerUrls).toEqual([]);
  });

  it('swaps the hash and the last explorer link when the transaction is replaced', () => {
    const exec = execution(swapTx, [], {
      hash: 'OLD',
      explorerUrls: [
        { url: 'https://scan/approve', description: 'Approve' },
        { url: 'https://scan/old', description: 'Swap' },
      ],
    });

    const next = reduce(
      exec,
      {
        type: 'tx_replaced',
        stepIndex: 0,
        hash: 'NEW',
        explorerUrl: 'https://scan/new',
      },
      NOW
    );

    expect(next.steps[0]).toMatchObject({
      hash: 'NEW',
      explorerUrls: [
        { url: 'https://scan/approve', description: 'Approve' },
        { url: 'https://scan/new', description: 'Replaced Swap' },
      ],
    });
  });

  it('takes what tracking reports and keeps what it leaves null', () => {
    const exec = execution(swapTx, [], {
      outputAmount: '1',
      diagnosisUrl: 'https://diagnose',
      statusMessage: 'old',
    });

    const next = reduce(
      exec,
      {
        type: 'tracking',
        stepIndex: 0,
        outputAmount: '2',
        internalSteps: null,
        diagnosisUrl: null,
        explorerUrls: [{ url: 'https://scan/x', description: null }],
        statusMessage: null,
      },
      NOW
    );

    expect(next.steps[0]).toMatchObject({
      outputAmount: '2',
      internalSteps: null,
      diagnosisUrl: 'https://diagnose',
      explorerUrls: [{ url: 'https://scan/x', description: null }],
      statusMessage: 'old',
    });
  });

  it('replaces the transaction and forgets the send when the API renews it', () => {
    const exec = execution(swapTx, [], {
      hash: 'A',
      signRequestedAt: 1,
    });

    const next = reduce(
      exec,
      { type: 'tx_renewed', stepIndex: 0, tx: swapTx },
      NOW
    );

    expect(next.steps[0]).toMatchObject({
      tx: swapTx,
      hash: null,
      signRequestedAt: null,
    });
  });

  it('succeeds a step with its output amount', () => {
    const next = reduce(
      execution(swapTx),
      { type: 'step_succeeded', stepIndex: 0, outputAmount: '2' },
      NOW
    );

    expect(next.steps[0]).toMatchObject({
      status: 'success',
      outputAmount: '2',
    });
    expect(next.status).toBe('running');
  });

  it('parks and unparks a step', () => {
    const block = {
      reason: 'wallet_disconnected',
      walletType: 'metamask',
    } as const;

    const signRequested = reduce(
      execution(swapTx),
      { type: 'sign_requested', stepIndex: 0 },
      NOW
    );
    const blocked = reduce(
      signRequested,
      { type: 'blocked', stepIndex: 0, block },
      NOW
    );
    const unblocked = reduce(blocked, { type: 'unblocked', stepIndex: 0 }, NOW);

    expect(blocked.steps[0].blocked).toEqual(block);
    // The wallet was never asked, so the sign request is void.
    expect(blocked.steps[0].signRequestedAt).toBeNull();
    expect(unblocked.steps[0].blocked).toBeNull();
  });

  it('fails the swap and the step, mapping the action to the phase a host sees', () => {
    const next = reduce(
      execution(swapTx),
      {
        type: 'failed',
        failure: {
          code: SignerErrorCode.REJECTED_BY_USER,
          phase: 'execute_transaction',
          stepIndex: 0,
          message: 'no',
        },
      },
      NOW
    );

    expect(next).toMatchObject({
      status: 'failed',
      finishedAt: NOW,
      failure: {
        code: 'REJECTED_BY_USER',
        phase: 'sign',
        stepIndex: 0,
        detail: 'no',
        origin: 'client',
      },
    });
    expect(next.steps[0].status).toBe('failed');
  });

  it('keeps the origin a failure carries', () => {
    const next = reduce(
      execution(swapTx),
      {
        type: 'failed',
        failure: {
          code: 'TX_FAILED_IN_BLOCKCHAIN',
          phase: 'check_status',
          stepIndex: 0,
          origin: 'backend',
        },
      },
      NOW
    );

    expect(next.failure).toMatchObject({
      phase: 'track',
      detail: null,
      origin: 'backend',
    });
  });

  it('finishes the swap on succeeded', () => {
    const next = reduce(execution(swapTx), { type: 'succeeded' }, NOW);

    expect(next).toMatchObject({ status: 'success', finishedAt: NOW });
  });
});
