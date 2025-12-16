import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { Networks } from '@rango-dev/wallets-shared';

export function coin98() {
  const { coin98, ethereum } = window;

  if (!coin98) {
    return null;
  }

  const instances = new Map();

  // When disabled overring metamask
  if (coin98.provider) {
    instances.set(Networks.ETHEREUM, coin98.provider);
  }
  if (ethereum && ethereum.isCoin98) {
    instances.set(Networks.ETHEREUM, ethereum);
  }
  if (coin98.sol) {
    instances.set(Networks.SOLANA, coin98.sol);
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
  const evmInstance = instances?.get(Networks.ETHEREUM);
  if (!evmInstance) {
    throw new Error(
      'Coin98 not injected or EVM not enabled. Please check your wallet.'
    );
  }
  return evmInstance as EvmProviderApi;
}

export function solanaCoin98(): SolanaProviderApi {
  const instances = coin98();
  const solanaInstance = instances?.get(Networks.SOLANA);
  if (!solanaInstance) {
    throw new Error(
      'Coin98 Solana instance is not available. Ensure that Solana support is enabled in your wallet.'
    );
  }
  return solanaInstance as SolanaProviderApi;
}
