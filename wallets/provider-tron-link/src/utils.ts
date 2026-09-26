import type { Provider, TronLinkProviderApi } from './types.js';

import { TRON_NAMESPACE } from '@hub3js/namespaces';

export function tronlink(): Provider | null {
  const instances: Provider = new Map();
  const { tron } = window;

  if (tron?.isTronLink !== true) {
    return null;
  }

  instances.set(TRON_NAMESPACE, tron);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = tronlink();

  if (!instances) {
    throw new Error('TronLink is not injected. Please check your wallet.');
  }

  return instances;
}

export function tronTronlink(): TronLinkProviderApi {
  const instance = tronlink();
  const tronInstance = instance?.get(TRON_NAMESPACE);

  if (!tronInstance) {
    throw new Error(
      'TronLink not injected or Tron not enabled. Please check your wallet.'
    );
  }

  return tronInstance;
}
