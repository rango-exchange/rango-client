import type { Context } from '@hub3js/core';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';

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
  const { solana, tronLink } = trustwallet;
  if (solana && solana.isTrustWallet) {
    instances.set(LegacyNetworks.SOLANA, solana);
  }
  if (tronLink) {
    instances.set(LegacyNetworks.TRON, tronLink);
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

export function tronTrustWallet(): TronProviderApi {
  const instance = trustWallet();
  const tronInstance = instance?.get(LegacyNetworks.TRON);

  if (!tronInstance) {
    throw new Error(
      'TrustWallet not injected or Tron not enabled. Please check your wallet.'
    );
  }

  return tronInstance as TronProviderApi;
}

// Considering that the errors thrown in Trust Wallet in-app browser do not follow EIP-1193, we detect such errors and standardize them.
export function standardizeTrustWalletInAppBrowserError(
  _context: Context,
  error: unknown
) {
  if (typeof error === 'string' && error === 'cancelled') {
    const error = new Error('User rejected the request') as Error & {
      code: number;
    };
    error.code = 4001;
    return error;
  }
  return error;
}
