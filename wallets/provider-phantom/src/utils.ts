import type { ProviderAPI as UtxoProviderApi } from '@hub3js/bip122';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { InstanceMap } from '@hub3js/std/types';
import type { SolanaExternalProvider } from '@rango-dev/signer-solana';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [SOLANA_NAMESPACE]: SolanaExternalProvider;
  [UTXO_NAMESPACE]: UtxoProviderApi;
};
export type Provider = InstanceMap<ProviderObject>;

export function phantom(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum, bitcoin } = phantom;

  const instances: Provider = new Map();

  if (ethereum && ethereum.isPhantom) {
    instances.set(EVM_NAMESPACE, ethereum);
  }

  if (solana && solana.isPhantom) {
    instances.set(SOLANA_NAMESPACE, solana);
  }

  if (bitcoin && bitcoin.isPhantom) {
    instances.set(UTXO_NAMESPACE, bitcoin);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = phantom();

  if (!instances) {
    throw new Error('Phantom is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmPhantom(): EvmProviderApi {
  const instances = phantom();

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Phantom not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}

export function solanaPhantom(): SolanaProviderApi {
  const instance = phantom();
  const solanaInstance = instance?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'Phantom not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}

export function bitcoinPhantom(): SolanaProviderApi {
  const instance = phantom();
  const bitcoinInstance = instance?.get(UTXO_NAMESPACE);

  if (!bitcoinInstance) {
    throw new Error(
      'Phantom not injected or Bitcoin not enabled. Please check your wallet.'
    );
  }

  return bitcoinInstance;
}

export type BtcAccount = {
  address: string;
  publicKey: string;
  addressType: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh';
  purpose: 'payment' | 'ordinals';
};
