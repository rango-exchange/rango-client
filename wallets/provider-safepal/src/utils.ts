import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';
import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

type Provider = Map<string, unknown>;

export function safepal(): Provider | null {
  const { safepal: safePalSolana, safepalProvider: safePalEvm } = window;
  if (!safePalEvm && !safePalSolana) {
    return null;
  }
  const instances = new Map();
  if (safePalEvm) {
    instances.set(LegacyNetworks.ETHEREUM, safePalEvm);
  }
  if (safePalSolana) {
    instances.set(LegacyNetworks.SOLANA, safePalSolana);
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

export function solanaSafepal(): SolanaProviderApi {
  const instance = safepal();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);
  if (!solanaInstance) {
    throw new Error(
      'Safepal not injected or Solana not enabled. Please check your wallet.'
    );
  }
  return solanaInstance as SolanaProviderApi;
}

export async function getSolanaAccounts(
  instance: SolanaProviderApi
): Promise<ProviderConnectResult> {
  const solanaResponse = await instance.connect();
  const account = solanaResponse.publicKey.toString();
  return {
    accounts: [account],
    chainId: LegacyNetworks.SOLANA,
  };
}
