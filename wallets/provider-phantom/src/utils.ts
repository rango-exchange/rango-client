import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';
import type { ProviderAPI as SuiProviderApi } from '@rango-dev/wallets-core/namespaces/sui';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export type Provider = Map<string, unknown>;

export function phantom(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum, bitcoin, sui } = phantom;

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
  if (sui && sui.isPhantom) {
    instances.set(LegacyNetworks.SUI, sui);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = phantom();

  if (!instances) {
    throw new Error('Phantom is not injected. Please check your wallet.');
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
export function suiPhantom(): SuiProviderApi {
  const instance = phantom();
  const suiInstance = instance?.get(LegacyNetworks.SUI);

  if (!suiInstance) {
    throw new Error(
      'Phantom not injected or Sui not enabled. Please check your wallet.'
    );
  }

  return suiInstance;
}
