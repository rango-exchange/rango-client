import type { Failure, FailurePhase } from '../transitions';
import type { StepBlock } from '../types';

export type Action =
  | { type: 'create_transaction' }
  | { type: 'run_prerequisite'; prerequisiteIndex: number }
  | { type: 'execute_transaction' }
  /** The transaction is out without a hash in hand; look it up before tracking. */
  | { type: 'find_transaction_hash' }
  | { type: 'check_status' };

export type Decision =
  | { kind: 'no_action' }
  /** Every step succeeded; the swap is done. */
  | { kind: 'succeed' }
  | {
      kind: 'fail';
      stepIndex: number;
      phase: FailurePhase;
      code: Failure['code'];
      /** Raw detail for diagnostics; the host words the failure. */
      message?: string;
    }
  | { kind: 'blocked'; stepIndex: number; block: StepBlock }
  | { kind: 'run_action'; stepIndex: number; action: Action };
