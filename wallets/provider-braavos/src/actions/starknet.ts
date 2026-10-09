import type { Context, FunctionWithContext } from '@hub3js/core';

import { Hub3Error } from '@hub3js/core';
import {
  CAIP_STARKNET_CHAIN_ID,
  type ProviderAPI,
  type StarknetActions,
  utils,
} from '@hub3js/starknet';

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
      throw new Hub3Error('PROVIDER_UNEXPECTED', 'Error during connection', {
        cause: { connectResult, starknetInstance },
      });
    }
    if (
      starknetInstance?.chainId &&
      starknetInstance.chainId !== CAIP_STARKNET_CHAIN_ID
    ) {
      throw new Hub3Error(
        'PROVIDER_UNEXPECTED',
        `Please switch to Mainnet, current network is ${starknetInstance?.chainId}`,
        { cause: starknetInstance }
      );
    }

    return utils.formatAccountsToCAIP(connectResult);
  };
}
export const starknetActions = { connect };
