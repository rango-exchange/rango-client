import { TransactionStatus } from '@safe-global/safe-apps-sdk';

import { sdk } from './safe.js';

const POLL_INTERVAL = 5_000;

const waitMs = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * On-chain hashes already resolved, so a later lookup with one of them skips
 * the Safe gateway: it resolves by safeTxHash, and an on-chain hash makes
 * Safe{Wallet} log a harmless `Code 901`.
 */
const resolvedHashes = new Set<string>();

/**
 * Safe's `eth_sendTransaction` returns a safeTxHash. This waits for the Safe
 * transaction to reach an end state and returns its on-chain hash.
 */
export async function resolveTransactionHash(
  safeHash: string
): Promise<string> {
  if (resolvedHashes.has(safeHash)) {
    return safeHash;
  }

  let txHash: string | undefined;
  while (!txHash) {
    try {
      /** The SDK will be pinged until a txHash is available and the txStatus is in an end-state */
      const queued = await sdk.txs.getBySafeTxHash(safeHash);
      if (
        queued.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS ||
        queued.txStatus === TransactionStatus.AWAITING_EXECUTION
      ) {
        /** Mimic a status watcher by checking once every 5 seconds */
        await waitMs(POLL_INTERVAL);
      } else if (queued.txHash) {
        /** The txStatus is in an end-state (e.g. success) so we probably have a valid, on chain txHash*/
        txHash = queued.txHash;
      }
    } catch {
      txHash = safeHash;
    }
  }

  resolvedHashes.add(txHash);
  return txHash;
}
