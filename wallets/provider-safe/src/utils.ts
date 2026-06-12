import type { ChainId, ProviderAPI } from '@hub3js/evm';

import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';

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

/*
 * Safe runs as a Safe App inside the Safe{Wallet} iframe, so the provider can
 * only be created asynchronously once the SDK resolves the Safe info. We cache
 * the instance here so the hub actions (connect, getChainId, signers, …) can
 * retrieve it synchronously via `evmSafe()` after detection has completed.
 */
let safeProvider: SafeAppProvider | null = null;

export async function initSafe(): Promise<boolean> {
  const timeout = 200;
  const accountInfo = await Promise.race([
    sdk.safe.getInfo(),
    new Promise<undefined>((resolve) => setTimeout(resolve, timeout)),
  ]);

  if (!accountInfo) {
    safeProvider = null;
    return false;
  }

  safeProvider = new SafeAppProvider(accountInfo, sdk);
  return true;
}

export function evmSafe(): ProviderAPI {
  if (!safeProvider) {
    throw new Error(
      'Safe is not available. Make sure the dApp is running as a Safe App inside Safe{Wallet}.'
    );
  }

  return safeProvider as ProviderAPI;
}

/*
 * Safe is a contract wallet embedded in an iframe: the account is already
 * available without a connection prompt, so we read it with `eth_accounts`
 * instead of the default `eth_requestAccounts` (which Safe's provider does not
 * implement).
 */
export async function getSafeAccounts(
  instance: ProviderAPI
): Promise<{ accounts: string[]; chainId: ChainId }> {
  const [accounts, chainId] = await Promise.all([
    instance.request({ method: 'eth_accounts' }),
    instance.request({ method: 'eth_chainId' }),
  ]);

  return { accounts, chainId };
}
