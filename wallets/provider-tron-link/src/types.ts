import type { TRON_NAMESPACE } from '@hub3js/namespaces';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';

export type ProviderObject = {
  [TRON_NAMESPACE]: TronProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;

export type TronChangeAccountEvent = {
  isTronLink: boolean;
  message: {
    action: string;
    data: {
      address: string;
    };
  };
};
