import type { Accounts, AccountsWithActiveChain } from './types';
import type { Context } from '../../hub/namespace';

import { AccountId } from 'caip';

export function connectAndUpdateState() {
  return [
    'connect',
    async (context: Context, accounts: Accounts | AccountsWithActiveChain) => {
      const acc = Array.isArray(accounts)
        ? { accounts, network: null }
        : accounts;

      console.log({ accounts, acc, uThis: context });
      if (
        !acc.accounts.every((account) => {
          try {
            AccountId.parse(account);
            return true;
          } catch {
            return false;
          }
        })
      ) {
        throw new Error(
          `Your provider should format account addresses in CAIP-10 format. Your provided accounts: ${acc}`
        );
      }

      const [, setState] = context.state();
      setState('accounts', acc.accounts);
      if (acc.network) {
        setState('network', acc.network);
      }
      return accounts;
    },
  ] as const;
}

export const recommended = [connectAndUpdateState()];
