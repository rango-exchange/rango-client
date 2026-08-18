import type { Subscriber, SubscriberCleanUp } from '@hub3js/core';
import type { ProviderAPI, SuiActions } from '@hub3js/sui';

/*
 * OKX's Sui wallet-standard instance emits a `disconnect` event on its
 * `standard:events` feature when the user disconnects from the wallet UI.
 * Account switches come through `change` (handled by the core change
 * subscriber); disconnect is NOT surfaced there. The `disconnect` event is
 * undocumented in the wallet-standard types, which only declare `change`, hence
 * the cast on `.on`. `.on` returns an unsubscribe function that the cleanup invokes.
 */
function disconnectSubscriber(
  getInstance: () => ProviderAPI
): [Subscriber<SuiActions>, SubscriberCleanUp<SuiActions>] {
  let unsubscribe: (() => void) | void;

  return [
    (context) => {
      const instance = getInstance();

      if (!instance) {
        throw new Error(
          'Trying to subscribe to your Sui wallet, but seems its instance is not available.'
        );
      }

      unsubscribe = (
        instance.features['standard:events'].on as (
          event: string,
          listener: (event: unknown) => void
        ) => () => void
      )('disconnect', () => {
        context.action('disconnect');
      });
    },
    (_context, err) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }

      return err;
    },
  ];
}

export const suiHooks = { disconnectSubscriber };
