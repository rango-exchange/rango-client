import type { Accounts } from './types';
import type { Context } from '../../hub/namespace';

import { AccountId } from 'caip';

export function connectAndUpdateState() {
  return [
    'connect',
    async (context: Context, accounts: Accounts) => {
      console.log({ accounts, uThis: context });
      // TODO: Address Verification (CAIP)

      if (
        !accounts.every((account) => {
          try {
            AccountId.parse(account);
            return true;
          } catch {
            return false;
          }
        })
      ) {
        throw new Error(
          `Your provider should format account addresses in CAIP-10 format. Your provided accounts: ${accounts}`
        );
      }

      const [, setState] = context.state();
      setState('accounts', accounts);
      return accounts;
    },
  ] as const;
}

export const recommended = [connectAndUpdateState()];
