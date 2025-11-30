import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';

export type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: EvmProviderApi;
  [LegacyNetworks.TRON]: TronProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;

export type TronChangeAccountEvent = {
  isTronLink: boolean;
  message: {
    action: string;
    address: string;
  };
};
