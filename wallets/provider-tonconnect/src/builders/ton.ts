import type { ConnectedWallet, TonConnectUI } from '@tonconnect/ui';

import {
  ChangeAccountSubscriberBuilder,
  actions as commonActions,
} from '@rango-dev/wallets-core/namespaces/common';
import { type TonActions } from '@rango-dev/wallets-core/namespaces/ton';

const changeAccountSubscriber = (getInstance: () => TonConnectUI) =>
  new ChangeAccountSubscriberBuilder<
    ConnectedWallet | null,
    TonConnectUI,
    TonActions
  >()
    .getInstance(getInstance)
    /*
     * TON wallets don't implement account change events, and we can only listen to disconnect events
     * by checking the payload value.
     * More info: https://github.com/ton-blockchain/ton-connect/blob/main/wallet-guidelines.md
     */
    .onSwitchAccount(async (event, context) => {
      event.preventDefault();
      if (!event.payload) {
        commonActions.disconnect(context);
      }
    })
    .format(async () => [])
    .addEventListener((instance, callback) => {
      return instance.onStatusChange(callback);
    })
    .removeEventListener(() => {
      /*
       * We handle unsubscribing in the builder and by returning an unsubscribe function from 'addEventListener'
       */
    });

export const tonBuilders = { changeAccountSubscriber };
