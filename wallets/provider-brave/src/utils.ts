import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';

export function brave(): Provider | null {
  const { braveEthereum, braveSolana } = window;
  if (!braveEthereum || !braveSolana) {
    return null;
  }
  const instances: Provider = new Map();
  if (braveEthereum) {
    instances.set(EVM_NAMESPACE, braveEthereum);
  }
  if (braveSolana) {
    instances.set(SOLANA_NAMESPACE, braveSolana);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = brave();

  if (!instances) {
    throw new Error('Brave Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmBrave(): EvmProviderApi {
  const instances = brave();

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Brave Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}

export function solanaBrave(): SolanaProviderApi {
  const instance = brave();
  const solanaInstance = instance?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'Brave Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}
