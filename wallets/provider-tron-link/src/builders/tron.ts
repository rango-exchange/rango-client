import type { TronChangeAccountEvent } from '../types.js';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import {
  type ProviderAPI,
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';

import { tronTronlink } from '../utils.js';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<
    MessageEvent<TronChangeAccountEvent>,
    ProviderAPI,
    TronActions
  >()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      if (
        !event.payload?.data?.isTronLink ||
        event.payload.data.message.action !== 'accountsChanged'
      ) {
        event.preventDefault();
        return;
      }
      if (!event.payload?.data?.message.data.address || !tronTronlink().ready) {
        event.preventDefault();
        void context.action('connect');
      }
    })
    .format(async (_, event) =>
      utils.formatAccountsToCAIP([event.data.message.data.address])
    )
    .addEventListener((_, callback) => {
      window.addEventListener('message', callback);
    })
    .removeEventListener((_, callback) => {
      window.removeEventListener('message', callback);
    });

export const tronBuilders = { changeAccountSubscriber };
