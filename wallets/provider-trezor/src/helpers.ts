import type { TrezorConnect } from '@trezor/connect-web';

import {
  ETHEREUM_CHAIN_ID,
  Networks,
  type ProviderConnectResult,
  retryLazyImport,
} from '@rango-dev/wallets-shared';

import { getDerivationPath } from './state.js';

export const trezorErrorMessages: { [statusCode: string]: string } = {
  Failure_ActionCancelled: 'User rejected the transaction.',
};

// `@trezor/connect-web` is commonjs, when we are importing it dynamically, it has some differences in different tooling. for example vite (you can check widget-examples), goes throw error. this is a workaround for solving this interop issue.
export async function getTrezorModule() {
  const mod = await retryLazyImport(
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

export function getTrezorInstance() {
  /*
   * Instances have a required property which is `chainId` and is using in swap execution.
   * Here we are setting it as Ethereum always since we are supporting only eth for now.
   */
  const instances = new Map();

  instances.set(Networks.ETHEREUM, { chainId: ETHEREUM_CHAIN_ID });

  return instances;
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

/*
 * Using BigInt in the valueToHex function ensures that the function
 * can handle very large integer values that exceed the range of standard JavaScript number types.
 */
export const valueToHex = (value: string) => {
  const ZERO_BIGINT = BigInt(0);
  const HEX_BASE = 16;
  return BigInt(value) > ZERO_BIGINT
    ? `0x${BigInt(value).toString(HEX_BASE)}`
    : '0x0';
};

export const getTrezorNormalizedDerivationPath = (
  path: string // TrezorConnect needs master node to be added to derivation path
) => (path && !path.startsWith('m/') ? 'm/' + path : path);
