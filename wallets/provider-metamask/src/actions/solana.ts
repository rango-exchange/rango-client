import type { WalletStandardSolanaInstance } from '../types.js';
import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';

import {
  type SolanaActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/solana';

function connect(
  getInstance: () => WalletStandardSolanaInstance
): FunctionWithContext<SolanaActions['connect'], Context> {
  return async () => {
    const solanaInstance = getInstance();
    const connectResult = await solanaInstance.features[
      'standard:connect'
    ].connect();
    return utils.formatAccountsToCAIP(
      connectResult.accounts.map((account) => account.address)
    );
  };
}
function canEagerConnect(getInstance: () => WalletStandardSolanaInstance) {
  return async () => {
    const solanaInstance = getInstance();

    if (!solanaInstance) {
      throw new Error(
        'Trying to eagerly connect to your Solana wallet, but it seems that its instance is not available.'
      );
    }

    try {
      const result = await solanaInstance.features['standard:connect'].connect({
        silent: true,
      });
      return !!result.accounts.length;
    } catch {
      return false;
    }
  };
}
export const solanaActions = { connect, canEagerConnect };
