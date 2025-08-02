import type {
  AnyFunction,
  Subscriber,
  SubscriberCleanUp,
} from '@rango-dev/wallets-core';

import {
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
  type ProviderAPI,
  type SolanaActions,
} from '@rango-dev/wallets-core/namespaces/solana';
import { AccountId } from 'caip';

function changeAccountSubscriber(
  instance: () => ProviderAPI | undefined
): [Subscriber<SolanaActions>, SubscriberCleanUp<SolanaActions>] {
  let eventCallback: AnyFunction;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const solanaInstance = instance();

      if (!solanaInstance) {
        throw new Error(
          'Trying to subscribe to your Solana wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = (publicKey) => {
        /*
         * In Phantom, when user is switching to an account which is not connected to dApp yet, it returns a null.
         * So null means we don't have access to account and we 0 need to disconnect and let the user connect the account.
         */
        if (!publicKey) {
          context.action('disconnect');
          return;
        }

        setState('accounts', [
          AccountId.format({
            address: publicKey.toString(),
            chainId: {
              namespace: CAIP_NAMESPACE,
              reference: CAIP_SOLANA_CHAIN_ID,
            },
          }),
        ]);
      };
      solanaInstance.onAccountChange(eventCallback);

      return err;
    },
    (_context, err) => {
      const solanaInstance = instance();

      if (solanaInstance && solanaInstance.eventListenerMap?.onAccountChange) {
        delete solanaInstance.eventListenerMap.onAccountChange;
      }

      return err;
    },
  ];
}
export const safePalSolanaActions = { changeAccountSubscriber };
