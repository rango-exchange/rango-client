import type { TON_NAMESPACE } from '@hub3js/namespaces';
import type {
  TonConnectUI,
  TonConnectUiOptionsWithManifest,
} from '@tonconnect/ui';

export type Environments = TonConnectUiOptionsWithManifest;

type ProviderObject = {
  [TON_NAMESPACE]: TonConnectUI;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
