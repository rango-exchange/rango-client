import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';

export function coin98() {
  const { coin98 } = window;

  if (!coin98) {
    return null;
  }

  const instances = new Map();

  if (coin98.provider) {
    instances.set(EVM_NAMESPACE, coin98.provider);
  }
  if (coin98.sol) {
    instances.set(SOLANA_NAMESPACE, coin98.sol);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = coin98();

  if (!instances) {
    throw new Error('Coin98 is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmCoin98(): EvmProviderApi {
  const instances = coin98();
  const evmInstance = instances?.get(EVM_NAMESPACE);
  if (!evmInstance) {
    throw new Error(
      'Coin98 not injected or EVM not enabled. Please check your wallet.'
    );
  }
  return evmInstance as EvmProviderApi;
}

export function solanaCoin98(): SolanaProviderApi {
  const instances = coin98();
  const solanaInstance = instances?.get(SOLANA_NAMESPACE);
  if (!solanaInstance) {
    throw new Error(
      'Coin98 Solana instance is not available. Ensure that Solana support is enabled in your wallet.'
    );
  }
  return solanaInstance as SolanaProviderApi;
}
