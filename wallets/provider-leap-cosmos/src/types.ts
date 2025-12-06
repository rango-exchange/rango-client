import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as CosmosProviderApi } from '@rango-dev/wallets-core/namespaces/cosmos';

export type ProviderObject = {
  [LegacyNetworks.COSMOS]: CosmosProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
