import type { UTXO_NAMESPACE } from '@hub3js/namespaces';

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
  [UTXO_NAMESPACE]: VultisigZcashProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
