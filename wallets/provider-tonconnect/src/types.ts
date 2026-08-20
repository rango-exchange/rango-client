import type { TON_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';
import type {
  TonConnectUI,
  TonConnectUiOptionsWithManifest,
} from '@tonconnect/ui';

export type Environments = TonConnectUiOptionsWithManifest;

type ProviderObject = {
  [TON_NAMESPACE]: TonConnectUI;
};

export type Provider = InstanceMap<ProviderObject>;
