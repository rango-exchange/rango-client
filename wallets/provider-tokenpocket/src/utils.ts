import type { Provider } from './types.js';
import type { ProviderAPI } from '@hub3js/evm';

import { EVM_NAMESPACE } from '@hub3js/namespaces';

export function tokenPocket(): Provider | null {
  const { tokenpocket } = window;
  const ethereum = tokenpocket?.ethereum;
  if (!ethereum) {
    return null;
  }
  const instances: Provider = new Map();
  instances.set(EVM_NAMESPACE, ethereum);

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

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'TokenPocket Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
