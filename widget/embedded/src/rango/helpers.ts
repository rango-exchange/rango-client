import { Manager } from '@rangodev/queue-manager-core';
import { PendingSwap, PendingSwapStep } from '@rangodev/ui/dist/containers/History/types';
import { GenericTransactionType, TransactionType } from 'rango-sdk';
import { PendingSwapWithQueueID } from './rangoTypes';
import { SwapStorage } from './types';

export const getPendingSwaps = (manager: Manager | undefined) => {
  const result: PendingSwapWithQueueID[] = [];

  manager?.getAll().forEach((q, id) => {
    const storage = q.list.getStorage() as SwapStorage;

    if (storage?.swapDetails) {
      result.push({
        id,
        swap: storage?.swapDetails,
      });
    }
  });

  return result.sort((a, b) => Number(b.swap.creationTime) - Number(a.swap.creationTime));
};

/**
 *
 * Returns `steps`, if it's a `running` swap.
 * Each `PendingSwap` has a `steps` inside it, `steps` shows how many tasks should be created and run to finish the swap.
 *
 */
export const getCurrentStep = (swap: PendingSwap) => {
  return swap.steps.find((step) => step.status !== 'failed' && step.status !== 'success') || null;
};

export const isTxAlreadyCreated = (swap: PendingSwap, step: PendingSwapStep): boolean => {
  const result =
    swap.wallets[step.evmTransaction?.blockChain || ''] ||
    swap.wallets[step.evmApprovalTransaction?.blockChain || ''] ||
    swap.wallets[step.cosmosTransaction?.blockChain || ''] ||
    swap.wallets[step.solanaTransaction?.blockChain || ''] ||
    step.transferTransaction?.fromWalletAddress ||
    null;

  return result !== null;
};

export function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export const isEvmTransaction = (tx: Transaction): tx is EvmTransaction =>
  tx.type === TransactionType.EVM;
export const isCosmosTransaction = (tx: Transaction): tx is CosmosTransaction =>
  tx.type === TransactionType.COSMOS;
export const isSolanaTransaction = (tx: Transaction): tx is SolanaTransaction =>
  tx.type === TransactionType.SOLANA;
export const isTrasnferTransaction = (tx: Transaction): tx is TransferTransaction =>
  tx.type === TransactionType.TRANSFER;
