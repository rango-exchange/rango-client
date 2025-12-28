import type { Provider } from './types.js';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function tronlink(): Provider | null {
  const instances: Provider = new Map();
  const { tronLink } = window;

  if (!tronLink) {
    return null;
  }

  instances.set(LegacyNetworks.TRON, tronLink);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = tronlink();

  if (!instances) {
    throw new Error('TronLink is not injected. Please check your wallet.');
  }

  return instances;
}

export function tronTronlink(): TronProviderApi {
  const instance = tronlink();
  const tronInstance = instance?.get(LegacyNetworks.TRON);

  if (!tronInstance) {
    throw new Error(
      'TronLink not injected or Tron not enabled. Please check your wallet.'
    );
  }

  return tronInstance;
}
