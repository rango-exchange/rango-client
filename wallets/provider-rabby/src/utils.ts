import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Record<string, any>;
export function rabby(): Provider | null {
  const { ethereum } = window;

  if (!ethereum?.isRabby) {
    return null;
  }

  const instances = new Map();

  instances.set(LegacyNetworks.ETHEREUM, ethereum);

  return instances;
}

export function evmRabby(): EvmProviderApi {
  const instances = rabby();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Rabby not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}
