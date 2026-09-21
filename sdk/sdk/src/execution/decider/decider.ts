import type { SwapExecution } from '../types';
import type { Decision } from './types';

/**
 * What the record needs next. Pure, and only ever asked between actions, so
 * what it reads is what the last action left behind and nothing in flight.
 */
export function decide(exec: SwapExecution): Decision {
  if (exec.status !== 'running') {
    return { kind: 'no_action' };
  }

  const stepIndex = exec.steps.findIndex((step) => step.status !== 'success');

  if (stepIndex === -1) {
    return { kind: 'succeed' };
  }

  const step = exec.steps[stepIndex];
  if (step.status === 'failed') {
    return { kind: 'no_action' };
  }

  if (!step.tx) {
    return {
      kind: 'run_action',
      stepIndex,
      action: { type: 'create_transaction' },
    };
  }

  for (let index = 0; index < step.tx.prerequisites.length; index++) {
    const prerequisite = step.tx.prerequisites[index];
    const result = step.prerequisiteResults.find(
      (r) =>
        r.prerequisiteIndex === index &&
        r.prerequisiteType === prerequisite.type
    );

    if (!result || result.status === 'pending') {
      return {
        kind: 'run_action',
        stepIndex,
        action: {
          type: 'run_prerequisite',
          prerequisiteIndex: index,
        },
      };
    }
    if (result?.status === 'failed') {
      return {
        kind: 'fail',
        stepIndex,
        phase: 'run_prerequisites',
        code: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      };
    }
  }

  if (!step.hash) {
    if (step.submittedAt) {
      return {
        kind: 'run_action',
        stepIndex,
        action: { type: 'find_transaction_hash' },
      };
    }
    /*
     * The wallet was asked and never answered here, whether the page reloaded
     * or the call threw. It may have sent the transaction, so it is not asked
     * again.
     */
    if (step.signRequestedAt) {
      return {
        kind: 'fail',
        stepIndex,
        phase: 'execute_transaction',
        code: 'TX_EXPIRED',
        message:
          'The wallet was asked to sign and never answered; the transaction may already have been sent',
      };
    }
    return {
      kind: 'run_action',
      stepIndex,
      action: { type: 'execute_transaction' },
    };
  }

  return {
    kind: 'run_action',
    stepIndex,
    action: {
      type: 'check_status',
    },
  };
}
