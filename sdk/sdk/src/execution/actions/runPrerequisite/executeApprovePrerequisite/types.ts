import type { ActionContext } from '../../../context';
import type { SwapExecution } from '../../../types';
import type { WalletEnvironment } from '../../environment/mod';
import type { FindProxiedNamespace } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { Transaction } from 'rango-sdk';
import type {
  EvmApprovePrerequisite,
  EvmApprovePrerequisiteResult,
  TransactionType,
  TronApprovePrerequisite,
  TronApprovePrerequisiteResult,
} from 'rango-types';

/**
 * The namespace keys whose actions include `getAllowance`, which is what the
 * approve prerequisite needs to read and confirm an allowance. Resolves to
 * `'evm' | 'tron'`.
 */
export type ApproveNamespaceKey = {
  [K in keyof DefaultNamespaces]: DefaultNamespaces[K] extends {
    getAllowance: unknown;
  }
    ? K
    : never;
}[keyof DefaultNamespaces];

/** The hub namespace behind an approve-capable chain. */
export type ApproveNamespace<K extends ApproveNamespaceKey> =
  FindProxiedNamespace<K, DefaultNamespaces>;

export type ApprovePrerequisite =
  | EvmApprovePrerequisite
  | TronApprovePrerequisite;

export type ApprovePrerequisiteResult =
  | EvmApprovePrerequisiteResult
  | TronApprovePrerequisiteResult;

/** What the chain says about a sent approve transaction. */
export type ApproveTransactionStatus = 'pending' | 'success' | 'failed';

/**
 * What differs between chains when running an approve prerequisite. The
 * prerequisite itself is run by one chain-agnostic function.
 */
export interface ApproveAdapter<
  K extends ApproveNamespaceKey,
  Tx extends Transaction
> {
  prerequisiteType: ApprovePrerequisite['type'];
  namespaceKey: K;
  signerTxType: TransactionType;
  /**
   * Makes sure the wallet is in a state to be asked, before the allowance is
   * read through it and an approve is signed. Throws `ActionBlockedError` to
   * park the step when it is not.
   */
  ensureEnvironment: (
    exec: SwapExecution,
    context: ActionContext,
    blockChain: string
  ) => Promise<WalletEnvironment<K>>;
  /** Builds the approve transaction to sign. */
  buildApproveTransaction: (
    prerequisite: ApprovePrerequisite,
    namespace: ApproveNamespace<K>
  ) => Promise<Tx>;
  /** Reads the on-chain status of a sent approve transaction. */
  getTransactionStatus: (
    namespace: ApproveNamespace<K>,
    hash: string
  ) => Promise<ApproveTransactionStatus>;
}
