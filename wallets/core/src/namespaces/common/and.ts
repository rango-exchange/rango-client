import type { Accounts } from './types';
import type { Context } from '../../hub/namespace';

export function connectAndUpdateState() {
  return [
    'connect',
    async (context: Context, accounts: Accounts) => {
      console.log({ accounts, uThis: context });
      // TODO: Address Verification (CAIP)
      const [, setState] = context.state();
      setState('accounts', accounts);
      return accounts;
    },
  ] as const;
}

export const recommended = [connectAndUpdateState()];
