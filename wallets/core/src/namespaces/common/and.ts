import type {
  Accounts,
  AccountsWithActiveChain,
} from './../../types/accounts.js';
import type { Context } from '../../hub/namespaces/mod.js';

import { isValidCaipAddress } from './helpers.js';

export function connectAndUpdateStateForSingleNetwork(
  context: Context,
  accounts: Accounts
) {
  if (!accounts.every(isValidCaipAddress)) {
    throw new Error(
      `Your provider should format account addresses in CAIP-10 format. Your provided accounts: ${accounts}`
    );
  }

  const [, setState] = context.state();
  setState('accounts', accounts);
  setState('connected', true);
  return accounts;
}

export function connectAndUpdateStateForMultiNetworks(
  context: Context,
  accounts: AccountsWithActiveChain
) {
  if (!accounts.accounts.every(isValidCaipAddress)) {
    throw new Error(
      `Your provider should format account addresses in CAIP-10 format. Your provided accounts: ${accounts.accounts}`
    );
  }

  const [, setState] = context.state();
  setState('accounts', accounts.accounts);
  setState('network', accounts.network);
  setState('connected', true);
  return accounts;
}

export const recommended = [];
