import type { Provider } from './types.js';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function solflare(): Provider | null {
  const instances: Provider = new Map();
  const { solflare } = window;
  if (!solflare) {
    return null;
  }

  instances.set(LegacyNetworks.SOLANA, solflare);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = solflare();

  if (!instances) {
    throw new Error(
      'Solflare Wallet is not injected. Please check your wallet.'
    );
  }

  return instances;
}

export function solanaSolflare(): SolanaProviderApi {
  const instance = solflare();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Solflare Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}
