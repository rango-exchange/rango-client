import type { ConfirmedRoute } from '../confirmation/types';
import type { SwapperStatusStep, Transaction } from 'rango-sdk';

import {
  type APIErrorCode,
  type SignerErrorCode,
  type SwapExplorerUrl,
  type SwapSavedSettings,
  type TransactionPrerequisiteResult,
} from 'rango-types';

/** A wallet the user picked for one of the chains the route touches. */
export type SwapWallet = {
  walletType: string;
  address: string;
  derivationPath?: string;
};

export type SwapExecutionStatus = 'running' | 'failed' | 'success';

/**
 * The namespaces a wallet can be connected on. Values match the namespace
 * names used by the wallets layer, so a host can pass them through as-is.
 */
export type Namespace =
  | 'EVM'
  | 'Solana'
  | 'UTXO'
  | 'Starknet'
  | 'Tron'
  | 'Ton'
  | 'Sui'
  | 'XRPL'
  | 'Stellar';

/**
 * Why a step cannot make progress right now. The engine sets it when it parks
 * a step and clears it when the step runs again, so it is always the current
 * answer rather than a log. It holds data only; the host words it.
 */
export type StepBlock =
  /** The wallet this step needs is not connected. */
  | { reason: 'wallet_disconnected'; walletType: string }
  /** The wallet is connected, but not with the account the swap was started with. */
  | { reason: 'wrong_account'; walletType: string; requiredAddress: string }
  /** The wallet is on the wrong network for this step. */
  | {
      reason: 'wrong_network';
      walletType: string;
      namespace: Namespace;
      network: string;
      /**
       * `null`: the engine has not asked the wallet to switch. `requested`: it
       * has, and is waiting for the wallet to report the change. `failed`: the
       * wallet refused, so the user has to switch by hand.
       */
      switch: null | 'requested' | 'failed';
    }
  /** Another swap holds the wallet; this one resumes when that one lets go. */
  | { reason: 'waiting_for_another_swap'; walletType: string; heldBy: string };

export type StepBlockReason = StepBlock['reason'];

export type SwapFailurePhase =
  | 'build'
  | 'prerequisite'
  | 'sign'
  | 'track'
  | 'cancel';

/**
 * Why a swap stopped. Set once, when the swap fails. Codes and raw detail
 * only, so the host owns the wording.
 */
export type SwapFailure = {
  code: APIErrorCode | SignerErrorCode;
  phase: SwapFailurePhase;
  /** Index into `steps` of the step that failed, or `null` when none had started. */
  stepIndex: number | null;
  /** Raw text from the wallet or API, for diagnostics. Never shown as-is. */
  detail: string | null;
  /**
   * Where the failure was decided. Client-side failures are reported to the
   * API; backend-reported failures are not, since the API already knows.
   */
  origin: 'client' | 'backend';
  /** Structured facts about the failure a host may want to show, e.g. approval amounts. */
  data?: Record<string, string | number | boolean | null>;
};

export type SwapExecutionStepStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed';

/**
 * One step of the route, as the engine runs it. It carries only what running
 * the step produced; its description lives in `SwapExecution['route']` at the
 * same index.
 *
 * The step has only four statuses. What the step is doing within `running` is
 * derived from the fields: no `tx` means one has to be built; a `tx` with no
 * `hash` is waiting to be signed, once what `prerequisiteResults` tracks is
 * done; a `hash` is being tracked.
 */
export type SwapExecutionStep = {
  status: SwapExecutionStepStatus;
  /**
   * The transaction being worked on, or `null` before one is built. It is
   * already tagged by `type`, so a step needs one field rather than one per
   * chain.
   */
  tx: Transaction | null;
  /** Set once the transaction is on chain. */
  hash: string | null;
  /**
   * Set when a sign request was handed to the wallet, cleared when a hash
   * comes back. A step found with this set and no hash after a reload is
   * expired rather than signed again, because the wallet may already have
   * sent it.
   */
  signRequestedAt: number | null;
  /**
   * Set by namespaces where the transaction is submitted without a hash in
   * hand and the hash is discovered afterwards. Such a step is recovered
   * after a reload by looking the hash up rather than expired.
   */
  submittedAt: number | null;
  explorerUrls: SwapExplorerUrl[];
  /** Where the user is sent when a step needs support to look at it. */
  diagnosisUrl: string | null;
  /** What the step actually produced, once it succeeded. */
  outputAmount: string | null;
  /** The internal swaps the backend reports while tracking. Display only. */
  internalSteps: SwapperStatusStep[] | null;
  /** The backend's own note about the step while tracking, passed through untouched. */
  statusMessage: string | null;
  /** What had to happen before this step could run, e.g. a trustline. */
  prerequisiteResults: TransactionPrerequisiteResult[];
  /** Why the step is parked, or `null` when nothing is holding it. */
  blocked: StepBlock | null;
};

/**
 * A swap as the engine stores it: what is needed to run the route and resume
 * it after a reload, and nothing else.
 *
 * Anything a host shows is either derived from `route` or delivered as an
 * event. Nothing here is written for a reader — no messages, no severities, no
 * copy — so the host owns its wording and its translations.
 */
export type SwapExecution = {
  /** Also the swap's id; a host only ever deals in request ids. */
  requestId: string;
  /**
   * Increments on every change. A store rejects a write that does not carry
   * the version it holds, so two tabs cannot silently overwrite each other.
   */
  version: number;
  createdAt: number;
  /** Set when the swap stopped, whether it succeeded or failed. */
  finishedAt: number | null;
  status: SwapExecutionStatus;
  /** Set once, when `status` becomes `failed`. */
  failure: SwapFailure | null;
  /** The wallet picked for each chain the route touches, keyed by chain. */
  wallets: Record<string, SwapWallet>;
  settings: SwapSavedSettings;
  mode: 'swap' | 'refuel';
  /**
   * Whether the engine re-checks balances before running. It is `false` when
   * the user chose to start a swap the API said they were short for.
   */
  validateBalanceOrFee: boolean;
  route: ConfirmedRoute;
  /** One per step of `route`, in the same order. */
  steps: SwapExecutionStep[];
};

export type SwapExecutionResult = {
  hash: string;
};
