import type { Context, FunctionWithContext } from '@hub3js/core';

import {
  type SolanaActions,
  type ProviderAPI as SolanaProviderApi,
  utils,
} from '@hub3js/solana';

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
