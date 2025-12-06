import type { Provider } from './types.js';
import type { ProviderAPI as CosmosProviderApi } from '@rango-dev/wallets-core/namespaces/cosmos';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function leap(): Provider | null {
  const { leap } = window;
  if (!leap) {
    return null;
  }
  const instances: Provider = new Map();
  instances.set(LegacyNetworks.COSMOS, leap);
  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = leap();

  if (!instances) {
    throw new Error('Leap Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function cosmosLeap(): CosmosProviderApi {
  const instances = leap();

  const cosmosInstance = instances?.get(LegacyNetworks.COSMOS);

  if (!cosmosInstance) {
    throw new Error(
      'Leap Wallet not injected or Cosmos not enabled. Please check your wallet.'
    );
  }

  return cosmosInstance;
}
