import type {
  AnyFunction,
  Subscriber,
  SubscriberCleanUp,
} from '@rango-dev/wallets-core';
import type {
  ProviderAPI,
  UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

function disconnectSubscriber(
  instance: () => ProviderAPI
): [Subscriber<UtxoActions>, SubscriberCleanUp<UtxoActions>] {
  let eventCallback: AnyFunction;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const bitcoinInstance = instance();

      if (!bitcoinInstance) {
        throw new Error(
          'Trying to subscribe to your BTC wallet, but seems its instance is not available.'
        );
      }

      eventCallback = () => {
        context.action('disconnect');
      };
      bitcoinInstance.on('disconnect', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      const bitcoinInstance = instance();

      if (eventCallback && bitcoinInstance) {
        bitcoinInstance.removeListener('disconnect', eventCallback);
      }

      return err;
    },
  ];
}
export const utxoHooks = { disconnectSubscriber };
