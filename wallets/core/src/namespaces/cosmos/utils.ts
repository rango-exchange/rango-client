import type { CosmosChainAccounts } from './types.js';
import type { CaipAccount } from '../common/mod.js';

import { AccountId } from 'caip';

import { CAIP_NAMESPACE } from './constants.js';

export function formatAccountsToCAIP(accounts: CosmosChainAccounts[]) {
  return accounts.flatMap((networkAccounts) =>
    networkAccounts.accounts.map(
      (networkAccount) =>
        AccountId.format({
          address: networkAccount,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: networkAccounts.chainId,
          },
        }) as CaipAccount
    )
  );
}
