import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';
import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';

import {
  CAIP_NAMESPACE,
  type EvmActions,
  type ProviderAPI,
  utils,
} from '@rango-dev/wallets-core/namespaces/evm';
import { AccountId } from 'caip';

import { switchOrAddNetwork } from '../utils.js';

function connect(
  instance: () => ProviderAPI
): FunctionWithContext<EvmActions['connect'], Context> {
  return async (_context, chain) => {
    const evmInstance = instance();

    if (!evmInstance) {
      throw new Error(
        'Do your wallet injected correctly and is evm compatible?'
      );
    }

    if (chain) {
      await switchOrAddNetwork(evmInstance, chain);
    }

    const chainId = await evmInstance.request({ method: 'eth_chainId' });

    const result = await utils.getAccounts(evmInstance);

    const formatAccounts = result.accounts.map(
      (account) =>
        AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: chainId,
          },
        }) as CaipAccount
    );

    return {
      accounts: formatAccounts,
      network: result.chainId,
    };
  };
}
export const evmActions = { connect };
