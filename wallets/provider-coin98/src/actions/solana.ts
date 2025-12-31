import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';

import {
  type SolanaActions,
  type ProviderAPI as SolanaProviderApi,
  utils,
} from '@rango-dev/wallets-core/namespaces/solana';

function connect(
  getInstance: () => SolanaProviderApi
): FunctionWithContext<SolanaActions['connect'], Context> {
  return async () => {
    const solanaInstance = getInstance();
    const connectResult = await solanaInstance.connect();
    return utils.formatAccountsToCAIP(connectResult);
  };
}

export const solanaActions = { connect };
