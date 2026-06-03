import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export type EnkryptEvmProvider = EvmProviderApi & {
  selectedAddress: string;
};
export type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: EnkryptEvmProvider;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
