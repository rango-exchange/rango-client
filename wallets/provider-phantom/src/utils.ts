import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { ProviderAPI as SuiProviderApi } from '@hub3js/sui';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  SUI_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';

export type Provider = Map<string, unknown>;

export function phantom(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum, bitcoin, sui } = phantom;

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
  if (sui && sui.isPhantom) {
    instances.set(SUI_NAMESPACE, sui);
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

  return evmInstance as EvmProviderApi;
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
export function suiPhantom(): SuiProviderApi {
  const instance = phantom();
  const suiInstance = instance?.get(SUI_NAMESPACE);

  if (!suiInstance) {
    throw new Error(
      'Phantom not injected or Sui not enabled. Please check your wallet.'
    );
  }

  return suiInstance as SuiProviderApi;
}
