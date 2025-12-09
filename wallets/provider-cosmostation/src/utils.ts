import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function cosmostation(): Provider | null {
  const { cosmostation } = window;
  const instances = new Map();

  if (!cosmostation || !cosmostation.providers) {
    return null;
  }

  const evmInstance = cosmostation.providers.metamask;
  if (evmInstance) {
    instances.set(LegacyNetworks.ETHEREUM, evmInstance);
  }

  const cosmosInstance = cosmostation.providers.keplr;
  if (cosmosInstance) {
    instances.set(LegacyNetworks.COSMOS, cosmosInstance);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = cosmostation();

  if (!instances) {
    throw new Error(
      'Cosmostation Wallet is not injected. Please check your wallet.'
    );
  }

  return instances;
}

export function evmCosmostation(): EvmProviderApi {
  const instances = cosmostation();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Cosmostation Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function cosmosCosmostation(): SolanaProviderApi {
  const instance = cosmostation();
  const solanaInstance = instance?.get(LegacyNetworks.COSMOS);

  if (!solanaInstance) {
    throw new Error(
      'Cosmostation Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance as SolanaProviderApi;
}
