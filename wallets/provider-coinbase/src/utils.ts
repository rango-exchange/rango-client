import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';
import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

type Provider = Map<string, unknown>;

export function coinbase(): Provider | null {
  const { coinbaseWalletExtension, coinbaseSolana } = window;

  if (!coinbaseSolana && !coinbaseWalletExtension) {
    return null;
  }

  const instances = new Map();

  if (coinbaseWalletExtension) {
    instances.set(LegacyNetworks.ETHEREUM, coinbaseWalletExtension);
  }

  if (coinbaseSolana) {
    instances.set(LegacyNetworks.SOLANA, coinbaseSolana);
  }

  return instances;
}

export function evmCoinbase(): EvmProviderApi {
  const instances = coinbase();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Coinbase not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaCoinbase(): SolanaProviderApi {
  const instance = coinbase();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Coinbase not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}

export async function getSolanaAccounts(
  instance: any
): Promise<ProviderConnectResult> {
  await instance.connect();
  const account = instance.publicKey.toString();

  return {
    accounts: [account],
    chainId: LegacyNetworks.SOLANA,
  };
}
