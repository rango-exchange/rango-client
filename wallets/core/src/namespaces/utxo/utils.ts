import type { CaipAccount } from '../common/mod.js';

import { AccountId } from 'caip';

import { CAIP_BITCOIN_CHAIN_ID, CAIP_NAMESPACE } from './constants.js';

export function formatAccountsToCAIP(accounts: string[]) {
  return accounts.map(
    (account) =>
      AccountId.format({
        address: account.toString(),
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: CAIP_BITCOIN_CHAIN_ID,
        },
      }) as CaipAccount
  );
}
