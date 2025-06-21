import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Record<string, any>;
export function trustWallet(): Provider | null {
  const { trustwallet } = window;

  if (!trustwallet || !(trustwallet?.isTrust || trustwallet?.isTrustWallet)) {
    return null;
  }

  const instances = new Map();

  instances.set(LegacyNetworks.ETHEREUM, trustwallet);
  const { solana } = trustwallet;
  if (solana && solana.isTrustWallet) {
    instances.set(LegacyNetworks.SOLANA, solana);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = trustWallet();

  if (!instances) {
    throw new Error('Trust Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmTrustWallet(): EvmProviderApi {
  const instances = trustWallet();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'TrustWallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaTrustWallet(): SolanaProviderApi {
  const instance = trustWallet();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'TrustWallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance as SolanaProviderApi;
}
