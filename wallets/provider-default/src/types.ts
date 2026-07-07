import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: EvmProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
