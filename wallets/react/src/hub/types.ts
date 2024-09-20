import type {
  CommonNamespaces,
  FindProxiedNamespace,
} from '@rango-dev/wallets-core';

export type AllProxiedNamespaces = FindProxiedNamespace<
  keyof CommonNamespaces,
  CommonNamespaces
>;
