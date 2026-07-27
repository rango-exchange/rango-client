import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

type UtxoProviderObject = {
  [LegacyNetworks.BTC]: UtxoProviderApi;
  [LegacyNetworks.LTC]: UtxoProviderApi;
  [LegacyNetworks.DOGE]: UtxoProviderApi;
  [LegacyNetworks.BCH]: UtxoProviderApi;
};

export type UtxoProvider = Map<
  keyof UtxoProviderObject,
  UtxoProviderObject[keyof UtxoProviderObject]
>;

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [SOLANA_NAMESPACE]: SolanaProviderApi;
  [UTXO_NAMESPACE]: UtxoProvider;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
