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

export const getSafeProviderOrThrow = () => {
  if (!safeProvider) {
    throw new Error(
      'Safe is not available. Make sure the dApp is running as a Safe App inside Safe{Wallet}.'
    );
  }
  return safeProvider;
};
