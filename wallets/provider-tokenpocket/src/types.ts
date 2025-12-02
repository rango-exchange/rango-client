import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/evm';

export type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: ProviderAPI;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
