import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function exodus(): Provider | null {
  const { exodus } = window;
  if (!exodus) {
    return null;
  }
  const instances: Provider = new Map();
  if (exodus.ethereum) {
    instances.set(LegacyNetworks.ETHEREUM, exodus.ethereum);
  }
  if (exodus.solana) {
    instances.set(LegacyNetworks.SOLANA, exodus.solana);
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

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Exodus Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaExodus(): SolanaProviderApi {
  const instance = exodus();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Exodus Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance as SolanaProviderApi;
}
