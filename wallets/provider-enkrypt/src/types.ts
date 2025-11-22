import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

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
