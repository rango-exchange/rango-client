import type { TRON_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';

export type ProviderObject = {
  [TRON_NAMESPACE]: TronProviderApi;
};
export type Provider = InstanceMap<ProviderObject>;

export type TronChangeAccountEvent = {
  isTronLink: boolean;
  message: {
    action: string;
    data: {
      address: string;
    };
  };
};
