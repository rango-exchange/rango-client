import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function taho(): Provider | null {
  const { tally } = window;
  if (!tally) {
    return null;
  }
  const instances: Provider = new Map();
  instances.set(LegacyNetworks.ETHEREUM, tally);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = taho();

  if (!instances) {
    throw new Error('Taho Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmTaho(): EvmProviderApi {
  const instances = taho();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Taho Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
