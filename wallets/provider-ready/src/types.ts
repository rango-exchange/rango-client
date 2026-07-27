import type { STARKNET_NAMESPACE } from '@hub3js/namespaces';
import type { ProviderAPI as StarknetProviderAPI } from '@hub3js/starknet';

export type ProviderObject = {
  [STARKNET_NAMESPACE]: StarknetProviderAPI;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
