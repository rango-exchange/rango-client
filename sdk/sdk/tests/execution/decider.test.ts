import type { Decision } from '../../src/execution/decider/types';
import type {
  TransactionPrerequisite,
  TransactionPrerequisiteResult,
} from 'rango-types';

import { describe, expect, it } from 'vitest';

import { decide } from '../../src/execution/decider/decider';

import { execution, transaction } from './fakes';

/** Only the field the decider reads; the cast covers the rest. */
const approve = { type: 'APPROVE' } as unknown as TransactionPrerequisite;

function approveResult(
  status: TransactionPrerequisiteResult['status']
): TransactionPrerequisiteResult {
  return {
    prerequisiteIndex: 0,
    prerequisiteType: 'APPROVE',
    status,
  } as unknown as TransactionPrerequisiteResult;
}

const tx = transaction();
const txWithApprove = transaction([approve]);

const run = (action: Decision & { kind: 'run_action' }): Decision => action;

describe('decide', () => {
  it.each<[string, Parameters<typeof execution>, Decision]>([
    [
      'builds a transaction for a step without one',
      [null],
      run({
        kind: 'run_action',
        stepIndex: 0,
        action: { type: 'create_transaction' },
      }),
    ],
    [
      'runs a prerequisite that has no result yet',
      [txWithApprove],
      run({
        kind: 'run_action',
        stepIndex: 0,
        action: { type: 'run_prerequisite', prerequisiteIndex: 0 },
      }),
    ],
    [
      'runs a prerequisite that is still pending',
      [txWithApprove, [approveResult('pending')]],
      run({
        kind: 'run_action',
        stepIndex: 0,
        action: { type: 'run_prerequisite', prerequisiteIndex: 0 },
      }),
    ],
    [
      'fails the swap on a failed prerequisite',
      [txWithApprove, [approveResult('failed')]],
      {
        kind: 'fail',
        stepIndex: 0,
        phase: 'run_prerequisites',
        code: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      },
    ],
    [
      'asks the wallet to sign once the prerequisites are done',
      [txWithApprove, [approveResult('success')]],
      run({
        kind: 'run_action',
        stepIndex: 0,
        action: { type: 'execute_transaction' },
      }),
    ],
    [
      'asks the wallet to sign a built transaction',
      [tx],
      run({
        kind: 'run_action',
        stepIndex: 0,
        action: { type: 'execute_transaction' },
      }),
    ],
    [
      'expires a step the wallet was asked to sign and never answered',
      [tx, [], { signRequestedAt: 1 }],
      {
        kind: 'fail',
        stepIndex: 0,
        phase: 'execute_transaction',
        code: 'TX_EXPIRED',
      },
    ],
    [
      'looks the hash up for a submitted step, sign request on record or not',
      [tx, [], { signRequestedAt: 1, submittedAt: 1 }],
      run({
        kind: 'run_action',
        stepIndex: 0,
        action: { type: 'find_transaction_hash' },
      }),
    ],
    [
      'tracks a sent transaction',
      [tx, [], { hash: 'HASH' }],
      run({
        kind: 'run_action',
        stepIndex: 0,
        action: { type: 'check_status' },
      }),
    ],
    [
      'does nothing for a failed step',
      [tx, [], { status: 'failed' }],
      { kind: 'no_action' },
    ],
    [
      'succeeds once every step succeeded',
      [tx, [], { status: 'success' }],
      { kind: 'succeed' },
    ],
  ])('%s', (_, args, expected) => {
    expect(decide(execution(...args))).toMatchObject(expected);
  });

  it('does nothing for a swap that is not running', () => {
    const exec = { ...execution(tx), status: 'failed' as const };

    expect(decide(exec)).toEqual({ kind: 'no_action' });
  });
});
