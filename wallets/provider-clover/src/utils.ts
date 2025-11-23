import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function clover(): Provider | null {
  const { clover, clover_solana } = window;
  if (!clover || !clover_solana) {
    return null;
  }
  const instances: Provider = new Map();
  if (clover) {
    instances.set(LegacyNetworks.ETHEREUM, clover);
  }
  if (clover_solana) {
    instances.set(LegacyNetworks.SOLANA, clover_solana);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = clover();

  if (!instances) {
    throw new Error('Clover Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmClover(): EvmProviderApi {
  const instances = clover();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Clover Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaClover(): SolanaProviderApi {
  const instance = clover();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Brave Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance as SolanaProviderApi;
}
