import type { EnkryptEvmProvider, Provider } from './types.js';

import { EVM_NAMESPACE } from '@hub3js/namespaces';

export function enkrypt(): Provider | null {
  const { enkrypt } = window;
  const ethereum = enkrypt?.providers?.ethereum;
  if (!ethereum) {
    return null;
  }
  const instances: Provider = new Map();
  instances.set(EVM_NAMESPACE, ethereum);

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

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Enkrypt Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
