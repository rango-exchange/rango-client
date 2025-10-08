import type {
  CommonNamespaces,
  FindProxiedNamespace,
  ProviderInfo,
} from '@rango-dev/wallets-core';

export type AllProxiedNamespaces = FindProxiedNamespace<
  keyof CommonNamespaces,
  CommonNamespaces
>;

export type ExtensionLink = keyof ProviderInfo['extensions'];
