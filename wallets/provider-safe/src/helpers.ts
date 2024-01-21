import { waitMs } from '@rango-dev/signer-evm';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';

const options = {
  debug: false,
};

/*
 * similar to:
 * https://github.com/wagmi-dev/references/pull/114
 */
let SDK = SafeAppsSDK;
if (
  typeof SafeAppsSDK !== 'function' &&
  // @ts-expect-error This import error is not visible to TypeScript
  typeof SafeAppsSDK.default === 'function'
) {
  SDK = (SafeAppsSDK as unknown as { default: typeof SafeAppsSDK }).default;
}
export const sdk = new SDK(options);

export async function getSafeInstance(): Promise<any> {
  const timeout = 200;
  const accountInfo = await Promise.race([
    sdk.safe.getInfo(),
    new Promise<undefined>((resolve) => setTimeout(resolve, timeout)),
  ]);
  return accountInfo ? new SafeAppProvider(accountInfo, sdk as any) : null;
}

export async function getTxHash(safeHash: string): Promise<{ txHash: string }> {
  let txHash;
  const timeout = 5_000;

  while (!txHash) {
    try {
      /** The SDK will be pinged until a txHash is available and the txStatus is in an end-state */
      const queued = await sdk.txs.getBySafeTxHash(safeHash);
      if (
        queued.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS ||
        queued.txStatus === TransactionStatus.AWAITING_EXECUTION
      ) {
        /** Mimic a status watcher by checking once every 5 seconds */
        await waitMs(timeout);
      } else if (queued.txHash) {
        /** The txStatus is in an end-state (e.g. success) so we probably have a valid, on chain txHash*/
        txHash = queued.txHash;
      }
    } catch {
      txHash = safeHash;
    }
  }
  return { txHash };
}
