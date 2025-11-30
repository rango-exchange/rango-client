import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function bitget(): Provider | null {
  const instances: Provider = new Map();
  const { bitkeep } = window;

  if (!bitkeep) {
    return null;
  }

  if (bitkeep.ethereum) {
    instances.set(LegacyNetworks.ETHEREUM, bitkeep.ethereum);
  }

  if (bitkeep.tronLink) {
    instances.set(LegacyNetworks.TRON, bitkeep.tronLink);
  }
  if (bitkeep.unisat) {
    instances.set(LegacyNetworks.BTC, bitkeep.unisat);
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

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Bitget not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function tronBitget(): TronProviderApi {
  const instance = bitget();
  const tronInstance = instance?.get(LegacyNetworks.TRON);

  if (!tronInstance) {
    throw new Error(
      'Bitget not injected or Tron not enabled. Please check your wallet.'
    );
  }

  return tronInstance;
}
export function utxoBitget(): UtxoProviderApi {
  const instance = bitget();
  const utxoInstance = instance?.get(LegacyNetworks.BTC);

  if (!utxoInstance) {
    throw new Error(
      'Bitget not injected or BTC not enabled. Please check your wallet.'
    );
  }

  return utxoInstance;
}
