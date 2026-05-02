import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export type VultisigZcashProviderApi = {
  requestAccounts: () => Promise<string[]>;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export type ProviderObject = {
  [LegacyNetworks.ZCASH]: VultisigZcashProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
