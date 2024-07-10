import type { EvmActions, ProviderApi } from './types.js';
import type { Context, Subscriber } from '../../hub/namespaces/mod.js';
import type { SubscriberCleanUp } from '../../hub/namespaces/types.js';
import type { CaipAccount, FunctionWithContext } from '../common/types.js';
import type { EIP1193EventMap } from 'viem';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions.js';

import { CAIP_NAMESPACE } from './constants.js';
import { getAccounts, switchOrAddNetwork } from './utils.js';

export const recommended = [...commonRecommended];

export function connect(
  instance: () => ProviderApi
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

    const result = await getAccounts(evmInstance);

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

    console.log('[evm] you are a trader?', { formatAccounts });

    return {
      accounts: formatAccounts,
      network: result.chainId,
    };
  };
}

export function changeAccountSubscriber(
  instance: () => ProviderApi
): [Subscriber, SubscriberCleanUp] {
  let eventCallback: EIP1193EventMap['accountsChanged'];

  return [
    (context) => {
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Trying to subscribe to your EVM wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = async (accounts) => {
        const chainId = await evmInstance.request({ method: 'eth_chainId' });

        const formatAccounts = accounts.map((account) =>
          AccountId.format({
            address: account,
            chainId: {
              namespace: CAIP_NAMESPACE,
              reference: chainId,
            },
          })
        );

        setState('accounts', formatAccounts);
        console.log('[evm] Accounts changed:', accounts, { context });
      };
      evmInstance.on('accountsChanged', eventCallback);
    },
    () => {
      const evmInstance = instance();

      if (eventCallback && evmInstance) {
        evmInstance.removeListener('accountsChanged', eventCallback);
      }
    },
  ];
}
