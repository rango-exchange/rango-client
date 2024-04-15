import type { EvmActions, NamespaceProvider } from './types';
import type { Context, SubscriberCb } from '../../hub/namespace';
import type { FunctionWithContext } from '../common/types';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions';

import { getAccounts, switchOrAddNetwork } from './utils';

export const recommended = [...commonRecommended];

export function connect(
  instance: () => NamespaceProvider
): ['connect', FunctionWithContext<EvmActions['connect'], Context>] {
  return [
    'connect',
    async (_context, chain) => {
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Are your wallet injected correctly and is evm compatible?'
        );
      }

      if (chain) {
        // TODO: Check failed scenario to not stuck in a loop
        await switchOrAddNetwork(evmInstance, chain);
      }

      const result = await getAccounts(evmInstance);

      const formatAccounts = result.accounts.map((account) =>
        AccountId.format({
          address: account,
          // TODO: export from core
          chainId: {
            namespace: 'eip155',
            reference: '1',
          },
        })
      );
      console.log('you are a trader? using evm?', result, formatAccounts);
      return {
        accounts: formatAccounts,
        network: result.chainId,
      };
    },
  ] as const;
}

export function changeAccountSubscriber(
  instance: () => NamespaceProvider
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
          // TODO: export from core
          chainId: {
            namespace: 'eip155',
            reference: '1',
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
