import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { FindProxiedNamespace } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { Transaction } from 'rango-sdk';
import type {
  EvmApprovePrerequisite,
  EvmApprovePrerequisiteResult,
  TransactionPrerequisite,
  TransactionPrerequisiteResult,
  TransactionPrerequisiteType,
  TransactionType,
  TronApprovePrerequisite,
  TronApprovePrerequisiteResult,
} from 'rango-types';
import type { Result } from 'ts-results';

/**
 * The hub namespace keys whose namespace exposes the `getAllowance` read action —
 * i.e. the chains the generic approve actions support. Resolves to `'evm' | 'tron'`.
 */
export type ApproveCapableNamespaceId = {
  [K in keyof DefaultNamespaces]: DefaultNamespaces[K] extends {
    getAllowance: unknown;
  }
    ? K
    : never;
}[keyof DefaultNamespaces];

/** The concrete hub namespace backing an approve-capable chain. */
export type ApproveCapableNamespace<K extends ApproveCapableNamespaceId> =
  FindProxiedNamespace<K, DefaultNamespaces>;

/** The approve prerequisites handled by the generic approve actions. */
export type ApprovePrerequisite =
  | EvmApprovePrerequisite
  | TronApprovePrerequisite;

/** The approve prerequisite results (any status) handled by the generic actions. */
export type ApprovePrerequisiteResult =
  | EvmApprovePrerequisiteResult
  | TronApprovePrerequisiteResult;

/** Outcome of polling a submitted approve transaction. */
export type ApproveTransactionStatus = 'pending' | 'success' | 'failed';

/**
 * The executed (pending/success/failed) approve prerequisite results — the
 * members of the union that carry an executed transaction hash.
 */
export type ExecutedApproveResult = Extract<
  TransactionPrerequisiteResult,
  { data: { executedTransactionHash: string } }
>;

/** Sends the approve transaction through the wallet's namespace. */
export type NamespaceApproveSender<
  K extends ApproveCapableNamespaceId,
  TTransaction extends Transaction
> = {
  through: 'namespace';
  sendTransaction: (
    namespace: ApproveCapableNamespace<K>,
    transaction: TTransaction,
    walletAddress: string,
    chainId: string | null
  ) => Promise<{ hash: string }>;
};

/**
 * Sends the approve transaction through the wallet's signer for `txType`, for
 * chains whose namespace can't sign yet.
 */
export type SignerApproveSender = {
  through: 'signer';
  txType: TransactionType;
};

/**
 * EVM approvals always go through the namespace; only other chains may still
 * fall back to a signer.
 */
export type ApproveSender<
  K extends ApproveCapableNamespaceId,
  TTransaction extends Transaction
> = [K] extends ['evm']
  ? NamespaceApproveSender<K, TTransaction>
  : NamespaceApproveSender<K, TTransaction> | SignerApproveSender;

/**
 * Per-chain strategy for the generic approve-prerequisite actions. Everything
 * that differs between EVM and Tron is captured here; the actions themselves are
 * chain-agnostic.
 */
export interface ApproveAdapter<
  K extends ApproveCapableNamespaceId,
  TTransaction extends Transaction
> {
  /** The prerequisite type this adapter handles, e.g. `EVM_APPROVE`. */
  prerequisiteType: TransactionPrerequisiteType;
  /** The hub namespace key backing this chain, e.g. `'evm'` | `'tron'`. */
  namespaceKey: K;
  /** Type guard for this chain's approve prerequisite. */
  isApprovePrerequisite: (
    prerequisite: TransactionPrerequisite
  ) => prerequisite is ApprovePrerequisite;
  /** Type guard for this chain's approve prerequisite result (any status). */
  isApprovePrerequisiteResult: (
    prerequisiteResult: TransactionPrerequisiteResult
  ) => prerequisiteResult is ApprovePrerequisiteResult;
  /** Builds a signable approve transaction for the given prerequisite. */
  buildApproveTransaction: (
    prerequisite: ApprovePrerequisite,
    namespace: ApproveCapableNamespace<K>
  ) => Promise<Result<TTransaction, NextTransactionStateError>>;
  /** How the signed approve transaction is sent. */
  send: ApproveSender<K, TTransaction>;
  /** Reads the on-chain status of a submitted approve transaction. */
  getTransactionStatus: (
    namespace: ApproveCapableNamespace<K>,
    executedTransactionHash: string
  ) => Promise<ApproveTransactionStatus>;
}
