import type { FindProxiedNamespace, ProviderMetadata } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';

export type AllProxiedNamespaces = FindProxiedNamespace<
  keyof DefaultNamespaces,
  DefaultNamespaces
>;

export type ExtensionLink = keyof ProviderMetadata['extensions'];
