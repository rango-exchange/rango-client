import type { Accounts, AccountsWithActiveChain } from './types.js';
import type { Context } from '../../hub/namespace.js';

import { isValidCaipAddress } from './helpers.js';

export function connectAndUpdateStateForSingleNetwork() {
  return [
    'connect',
    (context: Context, accounts: Accounts) => {
      if (!accounts.every(isValidCaipAddress)) {
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

export function connectAndUpdateStateForMultiNetworks() {
  return [
    'connect',
    (context: Context, accounts: AccountsWithActiveChain) => {
      if (!accounts.accounts.every(isValidCaipAddress)) {
        throw new Error(
          `Your provider should format account addresses in CAIP-10 format. Your provided accounts: ${accounts.accounts}`
        );
      }

      const [, setState] = context.state();
      setState('accounts', accounts.accounts);
      setState('network', accounts.network);
      return accounts;
    },
  ] as const;
}

export const recommended = [];
