import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { EVM_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';

export type EnkryptEvmProvider = EvmProviderApi & {
  selectedAddress: string;
};
export type ProviderObject = {
  [EVM_NAMESPACE]: EnkryptEvmProvider;
};
export type Provider = InstanceMap<ProviderObject>;
