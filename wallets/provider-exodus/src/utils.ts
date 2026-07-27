import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';

export function exodus(): Provider | null {
  const { exodus } = window;
  if (!exodus) {
    return null;
  }
  const instances: Provider = new Map();
  if (exodus.ethereum) {
    instances.set(EVM_NAMESPACE, exodus.ethereum);
  }
  if (exodus.solana) {
    instances.set(SOLANA_NAMESPACE, exodus.solana);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = exodus();

  if (!instances) {
    throw new Error('Exodus Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmExodus(): EvmProviderApi {
  const instances = exodus();

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Exodus Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaExodus(): SolanaProviderApi {
  const instance = exodus();
  const solanaInstance = instance?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'Exodus Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}
