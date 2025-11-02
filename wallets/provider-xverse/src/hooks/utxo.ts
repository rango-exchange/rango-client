import type {
  AnyFunction,
  Subscriber,
  SubscriberCleanUp,
} from '@rango-dev/wallets-core';
import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/cosmos';
import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

function getDisconnectSubscriber(
  instance: () => ProviderAPI | undefined
): [Subscriber<UtxoActions>, SubscriberCleanUp<UtxoActions>] {
  let subscriberCleanup: AnyFunction;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const utxoInstance = instance();

      if (!utxoInstance) {
        throw new Error(
          'Trying to subscribe to your UTXO wallet, but seems its instance is not available.'
        );
      }

      subscriberCleanup = utxoInstance.addListener('disconnect', () => {
        context.action('disconnect');
      });

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      subscriberCleanup?.();

      return err;
    },
  ];
}
export const utxoHooks = { getDisconnectSubscriber };
