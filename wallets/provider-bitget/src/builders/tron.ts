import type { TronChangeAccountEvent } from '../types.js';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import {
  type ProviderAPI,
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<
    MessageEvent<TronChangeAccountEvent>,
    ProviderAPI,
    TronActions
  >()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      if (
        !event.payload.data.isBitkeep ||
        event.payload.data.message?.action !== 'accountsChanged'
      ) {
        event.preventDefault();
        return;
      }
      if (!event.payload.data.message.data.address) {
        event.preventDefault();
        context.action('disconnect');
      }
    })
    .format(async (_, accounts) =>
      utils.formatAccountsToCAIP([accounts.data.message.data.address])
    )
    .addEventListener((_, callback) => {
      window.addEventListener('message', callback);
    })
    .removeEventListener((_, callback) => {
      window.removeEventListener('message', callback);
    });

export const tronBuilders = { changeAccountSubscriber };
