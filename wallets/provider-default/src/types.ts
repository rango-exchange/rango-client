import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { EVM_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';

type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
};

export type Provider = InstanceMap<ProviderObject>;
