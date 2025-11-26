import type {
  AnyFunction,
  Subscriber,
  SubscriberCleanUp,
} from '@rango-dev/wallets-core';
import type {
  ProviderAPI,
  SolanaActions,
} from '@rango-dev/wallets-core/namespaces/solana';

function getDisconnectSubscriber(
  instance: () => ProviderAPI
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

      eventCallback = () => {
        context.action('disconnect');
      };
      solanaInstance.on('disconnect', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      const solanaInstance = instance();

      if (eventCallback && solanaInstance) {
        solanaInstance.removeListener('disconnect', eventCallback);
      }

      return err;
    },
  ];
}
export const solanaHooks = { getDisconnectSubscriber };
