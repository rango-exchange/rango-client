import type { STARKNET_NAMESPACE } from '@hub3js/namespaces';
import type { ProviderAPI as StarknetProviderAPI } from '@hub3js/starknet';
import type { InstanceMap } from '@hub3js/std/types';

export type ProviderObject = {
  [STARKNET_NAMESPACE]: StarknetProviderAPI;
};
export type Provider = InstanceMap<ProviderObject>;
