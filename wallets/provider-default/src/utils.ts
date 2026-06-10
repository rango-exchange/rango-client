import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

/*
 * `provider-default` is the catch-all fallback for any injected EVM provider
 * (`window.ethereum`) when no known wallet has been detected, so detection is
 * intentionally permissive: any injected `ethereum` instance is accepted.
 */
export function defaultInjected(): Provider | null {
  const { ethereum } = window;

  if (!ethereum) {
    return null;
  }

  const instances = new Map();
  instances.set(LegacyNetworks.ETHEREUM, ethereum);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = defaultInjected();

  if (!instances) {
    throw new Error('ethereum is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmDefault(): EvmProviderApi {
  const instances = defaultInjected();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'No injected EVM provider found (window.ethereum). Please check your wallet.'
    );
  }

  return evmInstance;
}
