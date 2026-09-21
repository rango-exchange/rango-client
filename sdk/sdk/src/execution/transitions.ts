import type { StepBlock } from '../execution/types';
import type { SwapperStatusStep, Transaction } from 'rango-sdk';
import type {
  APIErrorCode,
  SignerErrorCode,
  TransactionPrerequisiteResult,
} from 'rango-types';

export type FailurePhase =
  | 'create_transaction'
  | 'run_prerequisites'
  | 'execute_transaction'
  | 'find_transaction_hash'
  | 'check_status'
  /** The host stopped the swap. */
  | 'cancel';

export type Failure = {
  code: APIErrorCode | SignerErrorCode;
  phase: FailurePhase;
  /** Index into `steps` of the step that failed, or `null` when none was left to run. */
  stepIndex: number | null;
  message?: string;
  /** Where the failure was decided; `backend` when the API reported it. Defaults to `client`. */
  origin?: 'client' | 'backend';
};

export type Transition =
  | { type: 'started' }
  | { type: 'step_started'; stepIndex: number }
  | { type: 'tx_built'; stepIndex: number; tx: Transaction }
  | {
      type: 'prerequisite_updated';
      stepIndex: number;
      result: TransactionPrerequisiteResult;
    }
  | { type: 'sign_requested'; stepIndex: number }
  /** The transaction reached the network but its hash is not known yet. */
  | { type: 'tx_submitted'; stepIndex: number }
  | {
      type: 'tx_sent';
      stepIndex: number;
      hash: string;
      explorerUrl: string | null;
    }
  | {
      type: 'tx_replaced';
      stepIndex: number;
      hash: string;
      explorerUrl: string | null;
    }
  | {
      type: 'tracking';
      stepIndex: number;
      outputAmount: string | null;
      internalSteps: SwapperStatusStep[] | null;
      diagnosisUrl: string | null;
      explorerUrls: { url: string; description: string | null }[] | null;
      statusMessage: string | null;
    }
  /** The backend replaced the transaction; it has to be signed again. */
  | { type: 'tx_renewed'; stepIndex: number; tx: Transaction }
  | { type: 'step_succeeded'; stepIndex: number; outputAmount: string }
  | { type: 'blocked'; stepIndex: number; block: StepBlock }
  | { type: 'unblocked'; stepIndex: number }
  | { type: 'failed'; failure: Failure }
  | { type: 'succeeded' };

export type TransitionType = Transition['type'];
