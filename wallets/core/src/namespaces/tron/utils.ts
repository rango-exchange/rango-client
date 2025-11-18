import type { CaipAccount } from '../common/mod.js';

import { AccountId } from 'caip';

import { CAIP_NAMESPACE, CAIP_TRON_CHAIN_ID } from './constants.js';

export function formatAccountsToCAIP(accounts: string[]) {
  return accounts.map(
    (account) =>
      AccountId.format({
        address: account.toString(),
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: CAIP_TRON_CHAIN_ID,
        },
      }) as CaipAccount
  );
}
