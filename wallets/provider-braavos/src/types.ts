import type { STARKNET_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';
import type { ProviderAPI as StarknetProviderAPI } from '@rango-dev/wallets-core/namespaces/starknet';

export type ProviderObject = {
  [STARKNET_NAMESPACE]: StarknetProviderAPI;
};
export type Provider = InstanceMap<ProviderObject>;
