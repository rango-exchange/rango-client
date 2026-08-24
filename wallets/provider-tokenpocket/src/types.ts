import type { ProviderAPI } from '@hub3js/evm';
import type { EVM_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';

export type ProviderObject = {
  [EVM_NAMESPACE]: ProviderAPI;
};
export type Provider = InstanceMap<ProviderObject>;
