import type { EnkryptEvmProvider, Provider } from './types.js';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function enkrypt(): Provider | null {
  const { enkrypt } = window;
  const ethereum = enkrypt?.providers?.ethereum;
  if (!ethereum) {
    return null;
  }
  const instances: Provider = new Map();
  instances.set(LegacyNetworks.ETHEREUM, ethereum);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = enkrypt();

  if (!instances) {
    throw new Error(
      'Enkrypt Wallet is not injected. Please check your wallet.'
    );
  }

  return instances;
}

export function evmEnkrypt(): EnkryptEvmProvider {
  const instances = enkrypt();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Enkrypt Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
