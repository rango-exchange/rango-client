import type { Provider } from './types.js';
import type { ProviderAPI as UtxoProviderApi } from '@hub3js/bip122';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';

import {
  EVM_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';

export function bitget(): Provider | null {
  const instances: Provider = new Map();
  const { bitkeep } = window;

  if (!bitkeep) {
    return null;
  }

  if (bitkeep.ethereum) {
    instances.set(EVM_NAMESPACE, bitkeep.ethereum);
  }

  if (bitkeep.tronLink) {
    instances.set(TRON_NAMESPACE, bitkeep.tronLink);
  }
  if (bitkeep.unisat) {
    instances.set(UTXO_NAMESPACE, bitkeep.unisat);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = bitget();

  if (!instances) {
    throw new Error('Bitget is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmBitget(): EvmProviderApi {
  const instances = bitget();

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Bitget not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}

export function tronBitget(): TronProviderApi {
  const instance = bitget();
  const tronInstance = instance?.get(TRON_NAMESPACE);

  if (!tronInstance) {
    throw new Error(
      'Bitget not injected or Tron not enabled. Please check your wallet.'
    );
  }

  return tronInstance;
}
export function utxoBitget(): UtxoProviderApi {
  const instance = bitget();
  const utxoInstance = instance?.get(UTXO_NAMESPACE);

  if (!utxoInstance) {
    throw new Error(
      'Bitget not injected or BTC not enabled. Please check your wallet.'
    );
  }

  return utxoInstance;
}
