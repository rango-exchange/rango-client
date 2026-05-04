import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export type SendTransactionArgs = {
  method: 'send_transaction';
  params: {
    from: string;
    to: string;
    value: string;
    memo: string | null;
  }[];
};

export type VultisigZcashProviderApi = {
  requestAccounts: () => Promise<string[]>;
  request: {
    (args: { method: 'get_accounts' }): Promise<string[]>;
    (args: SendTransactionArgs): Promise<string>;
  };
};

export type ProviderObject = {
  [LegacyNetworks.ZCASH]: VultisigZcashProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
