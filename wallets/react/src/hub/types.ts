import type {
  CommonNamespaces,
  FindProxiedNamespace,
  ProviderInfo,
} from '@arlert-dev/wallets-core';

export type AllProxiedNamespaces = FindProxiedNamespace<
  keyof CommonNamespaces,
  CommonNamespaces
>;

export type ExtensionLink = keyof ProviderInfo['extensions'];
