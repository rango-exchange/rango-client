import type { TrezorConnect } from '@trezor/connect-web';

import {
  dynamicImportWithRefinedError,
  ETHEREUM_CHAIN_ID,
  type ProviderConnectResult,
} from '@rango-dev/wallets-shared';

import { getDerivationPath } from './state.js';

export const trezorErrorMessages: { [statusCode: string]: string } = {
  Failure_ActionCancelled: 'User rejected the transaction.',
};

// `@trezor/connect-web` is commonjs, when we are importing it dynamically, it has some differences in different tooling. for example vite (you can check widget-examples), goes throw error. this is a workaround for solving this interop issue.
export async function getTrezorModule() {
  const mod = await dynamicImportWithRefinedError(
    async () => await import('@trezor/connect-web')
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (mod.default.default) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return mod.default.default as unknown as TrezorConnect;
  }

  return mod.default;
}

export async function getEthereumAccounts(): Promise<ProviderConnectResult> {
  const TrezorConnect = await getTrezorModule();
  const derivationPath = getDerivationPath();
  const result = await TrezorConnect.ethereumGetAddress({
    path: derivationPath,
  });

  if (!result.success) {
    throw new Error(result.payload.error);
  }

  return {
    accounts: [result.payload.address],
    chainId: ETHEREUM_CHAIN_ID,
    derivationPath,
  };
}

export const getTrezorNormalizedDerivationPath = (
  path: string // TrezorConnect needs master node to be added to derivation path
) => (path && !path.startsWith('m/') ? 'm/' + path : path);
