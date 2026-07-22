import type { ProviderAPI as StarknetProviderAPI } from '@hub3js/starknet';
import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export type ProviderObject = {
  [LegacyNetworks.STARKNET]: StarknetProviderAPI;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
