import type { UtxoCaipChainId } from './constants.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

/**
 * Ctrl exposes one provider instance per UTXO chain, keyed by that chain's
 * fully-qualified CAIP-2 id. The key type comes from `UTXO_CHAINS` so the map and the
 * chain list can't drift apart.
 */
export type UtxoProvider = Map<UtxoCaipChainId, UtxoProviderApi>;

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [SOLANA_NAMESPACE]: SolanaProviderApi;
  [UTXO_NAMESPACE]: UtxoProvider;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
