import type {
  AnyFunction,
  Context,
  Subscriber,
  SubscriberCleanUp,
} from '@hub3js/core';
import type { TonActions } from '@rango-dev/wallets-core/namespaces/ton';
import type {
  ConnectedWallet,
  ITonConnect,
  TonConnectUI,
} from '@tonconnect/ui';

import { tonConnect } from '../utils.js';

function getDisconnectSubscriber(
  instance: () => TonConnectUI
): [Subscriber<TonActions>, SubscriberCleanUp<TonActions>] {
  let eventCallback: AnyFunction;
  let unsubscribe: ReturnType<ITonConnect['onStatusChange']>;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const tonInstance = instance();

      if (!tonInstance) {
        throw new Error(
          'Trying to subscribe to your Ton wallet, but seems its instance is not available.'
        );
      }

      eventCallback = (wallet: null | ConnectedWallet) => {
        if (!wallet) {
          context.action('disconnect');
        }
      };

      unsubscribe = tonInstance.onStatusChange(eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_, err) => {
      if (unsubscribe) {
        unsubscribe();
      }

      return err;
    },
  ];
}

export async function handleProviderDisconnect(_: Context) {
  const tonInstance = tonConnect.getInstance();
  if (tonInstance.connected) {
    await tonInstance.disconnect();
  }
}

export const tonHooks = { getDisconnectSubscriber, handleProviderDisconnect };
