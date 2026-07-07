import type { ProviderAPI } from '@hub3js/evm';
import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: ProviderAPI;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
