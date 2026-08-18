import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import {
  type ProviderAPI,
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';

import { isOkxTronMessageEvent } from '../utils.js';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<
    MessageEvent<unknown>,
    ProviderAPI,
    TronActions
  >()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      const data = event.payload?.data;

      if (!isOkxTronMessageEvent(data)) {
        event.preventDefault();
        return;
      }

      const { action } = data.message;

      if (action === 'disconnect') {
        event.preventDefault();
        context.action('disconnect');
        return;
      }

      /*
       * Change account only on `accountsChanged` with a string address (`format`
       * reads it). Everything else — including `accountsChanged` with address
       * `false` (its disconnect is handled above) — is ignored.
       */
      if (
        action !== 'accountsChanged' ||
        typeof data.message.data?.address !== 'string'
      ) {
        event.preventDefault();
      }
    })
    .format(async (_, event) => {
      const data = event.data;
      const address =
        isOkxTronMessageEvent(data) && data.message.action === 'accountsChanged'
          ? data.message.data?.address
          : undefined;
      if (typeof address !== 'string') {
        throw new Error('No Tron address received from OKX Wallet.');
      }
      return utils.formatAccountsToCAIP([address]);
    })
    .addEventListener((_, callback) => {
      window.addEventListener('message', callback);
    })
    .removeEventListener((_, callback) => {
      window.removeEventListener('message', callback);
    });

export const tronBuilders = { changeAccountSubscriber };
