import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';

import {
  CAIP_STARKNET_CHAIN_ID,
  type ProviderAPI,
  type StarknetActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/starknet';

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<StarknetActions['connect'], Context> {
  return async () => {
    const starknetInstance = instance();

    const connectResult = await starknetInstance?.enable();
    if (
      !connectResult ||
      !starknetInstance.isConnected ||
      !connectResult?.length
    ) {
      throw new Error('Error during connection');
    }
    if (starknetInstance?.chainId !== CAIP_STARKNET_CHAIN_ID) {
      throw new Error(
        `Please switch to Mainnet, current network is ${starknetInstance?.chainId}`
      );
    }

    return utils.formatAccountsToCAIP(connectResult);
  };
}
export const starknetActions = { connect };
