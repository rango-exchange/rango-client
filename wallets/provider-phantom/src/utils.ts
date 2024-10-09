import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

type Provider = Map<string, unknown>;

export function phantom(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum } = phantom;

  const instances: Provider = new Map();

  if (ethereum && ethereum.isPhantom) {
    instances.set(LegacyNetworks.ETHEREUM, ethereum);
  }

  if (solana && solana.isPhantom) {
    instances.set(LegacyNetworks.SOLANA, solana);
  }

  return instances;
}

export function evmPhantom(): EvmProviderApi {
  const instances = phantom();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!instances || !evmInstance) {
    throw new Error(
      'Are you sure Phantom injected and you have enabled EVM correctly?'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaPhantom(): SolanaProviderApi {
  const instance = phantom();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!instance || !solanaInstance) {
    throw new Error(
      'Are you sure Phantom injected and you have enabled Solana correctly?'
    );
  }

  return solanaInstance;
}
