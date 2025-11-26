import type { Provider } from './types.js';
import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/evm';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function tokenPocket(): Provider | null {
  const { tokenpocket } = window;
  const ethereum = tokenpocket?.ethereum;
  if (!ethereum) {
    return null;
  }
  const instances: Provider = new Map();
  instances.set(LegacyNetworks.ETHEREUM, ethereum);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = tokenPocket();

  if (!instances) {
    throw new Error(
      'TokenPocket Wallet is not injected. Please check your wallet.'
    );
  }

  return instances;
}

export function evmTokenPocket(): ProviderAPI {
  const instances = tokenPocket();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'TokenPocket Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
