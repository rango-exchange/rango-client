import type { EIP1193EventMap } from './eip1193.js';
import type { EvmActions, ProviderAPI } from './types.js';
import type { Context, Subscriber } from '../../hub/namespaces/mod.js';
import type {
  CanEagerConnect,
  SubscriberCleanUp,
} from '../../hub/namespaces/types.js';
import type { CaipAccount } from '../../types/accounts.js';
import type { FunctionWithContext } from '../../types/actions.js';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions.js';

import { CAIP_NAMESPACE } from './constants.js';
import { getAccounts, switchOrAddNetwork } from './utils.js';

export const recommended = [...commonRecommended];

export function connect(
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

    return {
      accounts: formatAccounts,
      network: result.chainId,
    };
  };
}

export function changeAccountSubscriber(
  instance: () => ProviderAPI
): [Subscriber<EvmActions>, SubscriberCleanUp<EvmActions>] {
  let eventCallback: EIP1193EventMap['accountsChanged'];

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
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

      if (err instanceof Error) {
        throw err;
      }
    },
  ];
}

export function changeChainSubscriber(
  instance: () => ProviderAPI
): [Subscriber<EvmActions>, SubscriberCleanUp<EvmActions>] {
  let eventCallback: EIP1193EventMap['chainChanged'];

  return [
    (context) => {
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Trying to subscribe to your EVM wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = async (chainId: string) => {
        setState('network', chainId);
      };
      evmInstance.on('chainChanged', eventCallback);
    },
    () => {
      const evmInstance = instance();

      if (eventCallback && evmInstance) {
        evmInstance.removeListener('chainChanged', eventCallback);
      }
    },
  ];
}

export function canEagerConnect(
  instance: () => ProviderAPI | undefined
): CanEagerConnect<EvmActions> {
  return async () => {
    const evmInstance = instance();

    if (!evmInstance) {
      throw new Error(
        'Trying to eagerly connect to your EVM wallet, but seems its instance is not available.'
      );
    }

    try {
      const accounts: string[] = await evmInstance.request({
        method: 'eth_accounts',
      });
      if (accounts.length) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
}
