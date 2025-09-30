import type { ProviderAPI, SolanaActions } from './types.js';
import type { Context } from '../../hub/namespaces/mod.js';
import type { FunctionWithContext } from '../../types/actions.js';

import { recommended as commonRecommended } from '../common/actions.js';

import { formatAccountsToCAIP, getAccounts } from './utils.js';

export const recommended = [...commonRecommended];

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<SolanaActions['connect'], Context> {
  return async () => {
    const solanaInstance = instance();
    const result = await getAccounts(solanaInstance);

    if (Array.isArray(result)) {
      throw new Error(
        'Expecting solana response to be a single value, not an array.'
      );
    }

    return formatAccountsToCAIP(result.accounts);
  };
}
