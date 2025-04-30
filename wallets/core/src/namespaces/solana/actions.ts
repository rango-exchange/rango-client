import type { ProviderAPI, SolanaActions } from './types.js';
import type { Subscriber } from '../../hub/namespaces/mod.js';
import type { SubscriberCleanUp } from '../../hub/namespaces/types.js';
import type { AnyFunction } from '../../types/actions.js';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions.js';

import { CAIP_NAMESPACE, CAIP_SOLANA_CHAIN_ID } from './constants.js';

export const recommended = [...commonRecommended];

export function changeAccountSubscriber(
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
      solanaInstance.on('accountChanged', eventCallback);

      return err;
    },
    (_context, err) => {
      const solanaInstance = instance();

      if (eventCallback && solanaInstance) {
        solanaInstance.off('accountChanged', eventCallback);
      }

      return err;
    },
  ];
}
