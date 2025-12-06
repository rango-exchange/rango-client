import type { Provider } from './types.js';
import type { ProviderAPI as StarknetProviderAPI } from '@rango-dev/wallets-core/namespaces/starknet';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function braavos(): Provider | null {
  const instances: Provider = new Map();
  const { starknet_braavos } = window;

  if (!starknet_braavos) {
    return null;
  }

  instances.set(LegacyNetworks.STARKNET, starknet_braavos);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = braavos();

  if (!instances) {
    throw new Error('Braavos is not injected. Please check your wallet.');
  }

  return instances;
}

export function starknetBraavos(): StarknetProviderAPI {
  const instances = braavos();

  const starknetInstance = instances?.get(LegacyNetworks.STARKNET);

  if (!starknetInstance) {
    throw new Error(
      'Braavos not injected or Starknet not enabled. Please check your wallet.'
    );
  }

  return starknetInstance;
}
