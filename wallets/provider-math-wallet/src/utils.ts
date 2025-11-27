import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function mathWallet(): Provider | null {
  const { solana, ethereum } = window;
  const instances: Provider = new Map();
  if (ethereum && ethereum.isMathWallet) {
    instances.set(LegacyNetworks.ETHEREUM, ethereum);
  }
  if (solana && solana.isMathWallet) {
    instances.set(LegacyNetworks.SOLANA, solana);
  }
  if (instances.size === 0) {
    return null;
  }
  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = mathWallet();

  if (!instances) {
    throw new Error('Math Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmMathWallet(): EvmProviderApi {
  const instances = mathWallet();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Math Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaMathWallet(): SolanaProviderApi {
  const instance = mathWallet();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Math Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance as SolanaProviderApi;
}
