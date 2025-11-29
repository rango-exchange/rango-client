import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

export type ProviderObject = {
  [LegacyNetworks.SOLANA]: SolanaProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
