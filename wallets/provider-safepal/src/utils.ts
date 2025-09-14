import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Record<string, any>;
export function safepal(): Provider | null {
  const { safepalProvider: safePalEvm } = window;
  if (!safePalEvm) {
    return null;
  }
  const instances = new Map();
  if (safePalEvm) {
    instances.set(LegacyNetworks.ETHEREUM, safePalEvm);
  }

  return instances;
}

export function evmSafepal(): EvmProviderApi {
  const instances = safepal();
  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);
  if (!evmInstance) {
    throw new Error(
      'Safepal not injected or EVM not enabled. Please check your wallet.'
    );
  }
  return evmInstance as EvmProviderApi;
}
export function getInstanceOrThrow(): Provider {
  const instances = safepal();

  if (!instances) {
    throw new Error('Trust Wallet is not injected. Please check your wallet.');
  }

  return instances;
}
