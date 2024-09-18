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

export async function getSafeInstance(): Promise<any> {
  const timeout = 200;
  const accountInfo = await Promise.race([
    sdk.safe.getInfo(),
    new Promise<undefined>((resolve) => setTimeout(resolve, timeout)),
  ]);
  return accountInfo ? new SafeAppProvider(accountInfo, sdk as any) : null;
}
