import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as StarknetProviderAPI } from '@rango-dev/wallets-core/namespaces/starknet';

export type ProviderObject = {
  [LegacyNetworks.STARKNET]: StarknetProviderAPI;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
