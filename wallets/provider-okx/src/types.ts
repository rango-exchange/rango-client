import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

export type OkxBtcAddress = {
  address: string;
  publicKey: string;
  compressedPublicKey: string;
};
export type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: EvmProviderApi;
  [LegacyNetworks.SOLANA]: SolanaProviderApi;
  [LegacyNetworks.BTC]: UtxoProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
