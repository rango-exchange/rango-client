import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export type Provider = Map<string, unknown>;

export function phantom(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum, bitcoin } = phantom;

  const instances: Provider = new Map();

  if (ethereum && ethereum.isPhantom) {
    instances.set(LegacyNetworks.ETHEREUM, ethereum);
  }

  if (solana && solana.isPhantom) {
    instances.set(LegacyNetworks.SOLANA, solana);
  }

  if (bitcoin && bitcoin.isPhantom) {
    instances.set(LegacyNetworks.BTC, bitcoin);
  }

  return instances;
}

export function evmPhantom(): EvmProviderApi {
  const instances = phantom();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Phantom not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaPhantom(): SolanaProviderApi {
  const instance = phantom();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Phantom not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}

export function bitcoinPhantom(): SolanaProviderApi {
  const instance = phantom();
  const bitcoinInstance = instance?.get(LegacyNetworks.BTC);

  if (!bitcoinInstance) {
    throw new Error(
      'Phantom not injected or Bitcoin not enabled. Please check your wallet.'
    );
  }

  return bitcoinInstance;
}
