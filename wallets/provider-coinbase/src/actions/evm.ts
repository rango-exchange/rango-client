import type {
  Context,
  FunctionWithContext,
  Subscriber,
  SubscriberCleanUp,
} from '@rango-dev/wallets-core';
import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';

import {
  CAIP_NAMESPACE,
  type EIP1193EventMap,
  type EvmActions,
  type ProviderAPI,
  utils,
} from '@rango-dev/wallets-core/namespaces/evm';
import { AccountId } from 'caip';

function changeAccountSubscriber(
  instance: () => ProviderAPI
): [Subscriber<EvmActions>, SubscriberCleanUp<EvmActions>] {
  let eventCallback: EIP1193EventMap['accountsChanged'];
  return [
    (context, err) => {
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Trying to subscribe to your EVM wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = async (accounts) => {
        /*
         * In Phantom, when user is switching to an account which is not connected to dApp yet, it returns a null.
         * So null means we don't have access to account and we need to disconnect and let the user connect the account.
         *
         * This assumption may not work for other wallets, if that the case, we need to consider a new approach.
         */
        if (!accounts || accounts.length === 0) {
          context.action('disconnect');
          return;
        }

        const chainId = await evmInstance.request({ method: 'eth_chainId' });
        /*
         * Coinbase Wallet's `switch account` returns a list where the currently selected account
         * is always the first item. We're directly taking this first item as the active account.
         */

        const formattedAccount = [
          AccountId.format({
            address: accounts[0],
            chainId: {
              namespace: CAIP_NAMESPACE,
              reference: chainId,
            },
          }),
        ];

        setState('accounts', formattedAccount);
      };
      evmInstance.on('accountsChanged', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_, err) => {
      const evmInstance = instance();

      if (eventCallback && evmInstance) {
        evmInstance.removeListener('accountsChanged', eventCallback);
      }

      return err;
    },
  ];
}
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
      await utils.switchOrAddNetwork(evmInstance, chain);
    }

    const chainId = await evmInstance.request({ method: 'eth_chainId' });

    const result = await utils.getAccounts(evmInstance);

    /*
     * Coinbase Wallet's `connect` returns a list where the currently selected account
     * is always the first item. We're directly taking this first item as the active account.
     */
    return {
      accounts: [
        AccountId.format({
          address: result.accounts[0],
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: chainId,
          },
        }) as CaipAccount,
      ],
      network: result.chainId,
    };
  };
}
export const evmActions = { changeAccountSubscriber, connect };
