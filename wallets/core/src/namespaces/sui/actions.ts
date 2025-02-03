import type { ProviderAPI, SuiActions } from './types.js';
import type { Subscriber } from '../../hub/namespaces/mod.js';
import type { SubscriberCleanUp } from '../../hub/namespaces/types.js';
import type { AnyFunction } from '../../types/actions.js';

import { AccountId } from 'caip';

import { CAIP_NAMESPACE, CAIP_SUI_CHAIN_ID } from './constants.js';

export function changeAccountSubscriber(
  instance: () => ProviderAPI | undefined
): [Subscriber<SuiActions>, SubscriberCleanUp<SuiActions>] {
  let eventCallback: AnyFunction;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const suiInstance = instance();

      if (!suiInstance) {
        throw new Error(
          'Trying to subscribe to your Solana wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = (event) => {
        if (!event || !event.address) {
          context.action('disconnect');
          return;
        }

        setState('accounts', [
          AccountId.format({
            address: event.address,
            chainId: {
              namespace: CAIP_NAMESPACE,
              reference: CAIP_SUI_CHAIN_ID,
            },
          }),
        ]);
      };
      suiInstance.on('accountChanged', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      const suiInstance = instance();

      if (eventCallback && suiInstance) {
        suiInstance.off('accountChanged', eventCallback);
      }

      if (err instanceof Error) {
        throw err;
      }
    },
  ];
}
