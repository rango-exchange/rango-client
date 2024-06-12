import type { EvmActions, ProviderApi } from './types.js';
import type { Context, SubscriberCb } from '../../hub/namespace.js';
import type { CaipAccount, FunctionWithContext } from '../common/types.js';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions.js';

import { CAIP_ETHEREUM_CHAIN_ID, CAIP_NAMESPACE } from './constants.js';
import { getAccounts, switchOrAddNetwork } from './utils.js';

export const recommended = [...commonRecommended];

export function connect(
  instance: () => ProviderApi
): ['connect', FunctionWithContext<EvmActions['connect'], Context>] {
  return [
    'connect',
    async (_context, chain) => {
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Do your wallet injected correctly and is evm compatible?'
        );
      }

      if (chain) {
        // TODO: Check failed scenario to not stuck in a loop
        await switchOrAddNetwork(evmInstance, chain);
      }

      const result = await getAccounts(evmInstance);

      const formatAccounts = result.accounts.map(
        (account) =>
          AccountId.format({
            address: account,
            chainId: {
              namespace: CAIP_NAMESPACE,
              reference: CAIP_ETHEREUM_CHAIN_ID,
            },
          }) as CaipAccount
      );

      console.log('[evm] you are a trader?', { formatAccounts });

      return {
        accounts: formatAccounts,
        network: result.chainId,
      };
    },
  ] as const;
}

export function changeAccountSubscriber(
  instance: () => ProviderApi
): SubscriberCb {
  return (context) => {
    const evmInstance = instance();

    if (!evmInstance) {
      throw new Error(
        'Are your wallet injected correctly and is evm compatible?'
      );
    }

    const [, setState] = context.state();

    evmInstance.on('accountsChanged', (accounts) => {
      const formatAccounts = accounts.map((account) =>
        AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_ETHEREUM_CHAIN_ID,
          },
        })
      );

      setState('accounts', formatAccounts);
      console.log('[evm] Accounts changed:', accounts, { context });
    });

    return () => {
      // TODO: Write clean up
    };
  };
}
