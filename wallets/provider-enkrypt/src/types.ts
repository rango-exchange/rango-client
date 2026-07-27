import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { EVM_NAMESPACE } from '@hub3js/namespaces';

export type EnkryptEvmProvider = EvmProviderApi & {
  selectedAddress: string;
};
export type ProviderObject = {
  [EVM_NAMESPACE]: EnkryptEvmProvider;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
