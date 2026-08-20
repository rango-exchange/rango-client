import type { Context } from '@hub3js/core';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { InstanceMap } from '@hub3js/std/types';
import type { SolanaExternalProvider } from '@rango-dev/signer-solana';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [SOLANA_NAMESPACE]: SolanaExternalProvider;
};
export type Provider = InstanceMap<ProviderObject>;
export function trustWallet(): Provider | null {
  const { trustwallet } = window;

  if (!trustwallet || !(trustwallet?.isTrust || trustwallet?.isTrustWallet)) {
    return null;
  }

  const instances = new Map();

  instances.set(EVM_NAMESPACE, trustwallet);
  const { solana } = trustwallet;
  if (solana && solana.isTrustWallet) {
    instances.set(SOLANA_NAMESPACE, solana);
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

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'TrustWallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}

export function solanaTrustWallet(): SolanaProviderApi {
  const instance = trustWallet();
  const solanaInstance = instance?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'TrustWallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
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
