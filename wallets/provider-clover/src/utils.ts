import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';
import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

type Provider = Map<string, any>;

export function clover() {
  const { clover, clover_solana } = window;

  if (!clover) {
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

export function evmClover(): EvmProviderApi {
  const instances = clover();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Clover not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaClover(): SolanaProviderApi {
  const instance = clover();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Clover not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}

export async function getSolanaAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  const solanaInstance = instances.get(LegacyNetworks.SOLANA);
  const results: ProviderConnectResult[] = [];
  if (solanaInstance) {
    const solanaAccounts = await solanaInstance.getAccount();

    results.push({
      accounts: [solanaAccounts],
      chainId: LegacyNetworks.SOLANA,
    });
  }

  return results;
}
