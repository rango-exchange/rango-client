import { waitMs } from '@rango-dev/signer-evm';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';

const options = {
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
  debug: false,
};
export const sdk = new SafeAppsSDK(options);
export async function getSafeInstance(): Promise<any> {
  const accountInfo = await Promise.race([
    sdk.safe.getInfo(),
    new Promise<undefined>((resolve) => setTimeout(resolve, 200)),
  ]);
  return accountInfo ? new SafeAppProvider(accountInfo, sdk as any) : null;
}

export async function getTxHash(
  safeHash: string
): Promise<{ txHash: string; hashWasUpdated: boolean }> {
  let txHash;
  let hashWasUpdated = false;

  while (!txHash) {
    try {
      /** The SDK will be pinged until a txHash is available and the txStatus is in an end-state */
      const queued = await sdk.txs.getBySafeTxHash(safeHash);
      if (
        queued.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS ||
        queued.txStatus === TransactionStatus.AWAITING_EXECUTION
      ) {
        /** Mimic a status watcher by checking once every 5 seconds */
        await waitMs(5_000);
      } else if (queued.txHash) {
        /** The txStatus is in an end-state (e.g. success) so we probably have a valid, on chain txHash*/
        txHash = queued.txHash;
        hashWasUpdated = true;
      }
    } catch {
      txHash = safeHash;
      hashWasUpdated = true;
    }
  }
  return { txHash, hashWasUpdated };
}
