import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as CosmosProviderApi } from '@rango-dev/wallets-core/namespaces/cosmos';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

export type ProviderObject = {
  [LegacyNetworks.COSMOS]: CosmosProviderApi;
  [LegacyNetworks.ETHEREUM]: EvmProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
