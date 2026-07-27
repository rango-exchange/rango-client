import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Record<string, any>;

export function coinbase(): Provider | null {
  const { coinbaseWalletExtension, coinbaseSolana } = window;

  if (!coinbaseSolana && !coinbaseWalletExtension) {
    return null;
  }

  const instances = new Map();

  if (coinbaseWalletExtension) {
    instances.set(EVM_NAMESPACE, coinbaseWalletExtension);
  }

  if (coinbaseSolana) {
    instances.set(SOLANA_NAMESPACE, coinbaseSolana);
  }

  return instances;
}

export function evmCoinbase(): EvmProviderApi {
  const instances = coinbase();

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Coinbase not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaCoinbase(): SolanaProviderApi {
  const instance = coinbase();
  const solanaInstance = instance?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'Coinbase not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance as SolanaProviderApi;
}
export function getInstanceOrThrow(): Provider {
  const instances = coinbase();

  if (!instances) {
    throw new Error('Coinbase is not injected. Please check your wallet.');
  }

  return instances;
}
