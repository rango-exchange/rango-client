import type { ProviderAPI as EVMProviderAPI } from '../evm/types.js';
import type { ProviderAPI as SolanaProviderAPI } from '../solana/types.js';
import type { ProviderAPI as SuiProviderAPI } from '../sui/types.js';
import type { ProviderAPI as UTXOProviderAPI } from '../utxo/types.js';

/*
 * These are supported namespaces in Rango that we want to officially support.
 * This should be private and don't make it public since core can support more namespaces and should be extendable.
 */
type RangoNamespace =
  | 'EVM'
  | 'Solana'
  | 'Cosmos'
  | 'UTXO'
  | 'Starknet'
  | 'Tron'
  | 'Ton'
  | 'Sui';

export type SupportedProviderTypes =
  | EVMProviderAPI
  | SolanaProviderAPI
  | SuiProviderAPI
  | UTXOProviderAPI;
export type Namespace = RangoNamespace | (string & {});

export interface CommonActions {
  init: () => void;
}

export interface AutoImplementedActionsByRecommended {
  disconnect: () => void;
}

export type Provider = Map<string, unknown>;
