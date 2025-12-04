import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';

import {
  type ProviderAPI,
  type SolanaActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/solana';

function connect(
  instance: () => ProviderAPI
): FunctionWithContext<SolanaActions['connect'], Context> {
  return async () => {
    const solanaInstance = instance();
    const isConnected = await solanaInstance.connect();

    if (!isConnected) {
      throw new Error('Connecting to solana has been failed');
    }

    return utils.formatAccountsToCAIP([solanaInstance.publicKey.toString()]);
  };
}
function canEagerConnect(instance: () => ProviderAPI) {
  return () => {
    const solanaInstance = instance();

    if (!solanaInstance) {
      throw new Error(
        'Trying to eagerly connect to your Solana wallet, but seems its instance is not available.'
      );
    }
    return solanaInstance.isConnected;
  };
}
export const solanaActions = { canEagerConnect, connect };
