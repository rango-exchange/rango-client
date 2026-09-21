import type { DefaultNamespaces } from '@hub3js/namespaces';

import { TransactionType } from 'rango-types';

/**
 * The provider namespace that signs each transaction type, or `null` for a
 * type no namespace serves. A total record, so a new transaction type in
 * rango-types fails to compile here rather than silently getting no guard.
 */
export const SIGNING_NAMESPACES: Record<
  TransactionType,
  keyof DefaultNamespaces | null
> = {
  [TransactionType.EVM]: 'evm',
  // Signed as an EVM typed-data message, so the EVM namespace is the one that has to be connected.
  [TransactionType.HYPERLIQUID]: 'evm',
  [TransactionType.TRANSFER]: 'utxo',
  [TransactionType.SOLANA]: 'solana',
  [TransactionType.TRON]: 'tron',
  [TransactionType.STARKNET]: 'starknet',
  [TransactionType.TON]: 'ton',
  [TransactionType.SUI]: 'sui',
  [TransactionType.XRPL]: 'xrpl',
  [TransactionType.STELLAR]: 'stellar',
  [TransactionType.COSMOS]: null,
};
