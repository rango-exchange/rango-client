import type { Provider } from './types.js';
import type { ProviderAPI as StarknetProviderAPI } from '@rango-dev/wallets-core/namespaces/starknet';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function ready(): Provider | null {
  const instances: Provider = new Map();
  const { starknet_argentX } = window;

  if (!starknet_argentX) {
    return null;
  }

  instances.set(LegacyNetworks.STARKNET, starknet_argentX);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = ready();

  if (!instances) {
    throw new Error('Ready is not injected. Please check your wallet.');
  }

  return instances;
}

export function starknetReady(): StarknetProviderAPI {
  const instances = ready();

  const evmInstance = instances?.get(LegacyNetworks.STARKNET);

  if (!evmInstance) {
    throw new Error(
      'Ready not injected or Starknet not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
