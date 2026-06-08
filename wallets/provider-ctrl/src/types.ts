import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

export type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: EvmProviderApi;
  [LegacyNetworks.SOLANA]: SolanaProviderApi;
  [LegacyNetworks.BTC]: UtxoProviderApi;
  [LegacyNetworks.LTC]: UtxoProviderApi;
  [LegacyNetworks.DOGE]: UtxoProviderApi;
  [LegacyNetworks.BCH]: UtxoProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;

/** The UTXO chains grouped under the single UTXO namespace. */
export type UtxoNetwork =
  | LegacyNetworks.BTC
  | LegacyNetworks.LTC
  | LegacyNetworks.DOGE
  | LegacyNetworks.BCH;
