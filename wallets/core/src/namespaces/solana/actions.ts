import type { ProviderAPI, SolanaActions } from './types.js';
import type { Context } from '../../hub/namespaces/mod.js';
import type { CaipAccount } from '../../types/accounts.js';
import type { FunctionWithContext } from '../../types/actions.js';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions.js';

import { CAIP_NAMESPACE, CAIP_SOLANA_CHAIN_ID } from './constants.js';
import { getAccounts } from './utils.js';

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

    return result.accounts.map(
      (account) =>
        AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_SOLANA_CHAIN_ID,
          },
        }) as CaipAccount
    );
  };
}
export function canEagerConnect(instance: () => ProviderAPI) {
  return async () => {
    const solanaInstance = instance();

    if (!solanaInstance) {
      throw new Error(
        'Trying to eagerly connect to your Solana wallet, but seems its instance is not available.'
      );
    }

    try {
      const result = await solanaInstance.connect({ onlyIfTrusted: true });
      return !!result;
    } catch {
      return false;
    }
  };
}
