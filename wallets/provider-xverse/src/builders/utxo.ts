import type { XVerseEvent } from '../types.js';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import {
  type ProviderAPI,
  utils,
} from '@rango-dev/wallets-core/namespaces/utxo';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<XVerseEvent, ProviderAPI>()
    .getInstance(getInstance)
    .validateEventPayload((event) => !!event)
    .format(async (_, event) => {
      return utils.formatAccountsToCAIP(
        event.addresses
          .filter((address) => address.purpose === 'payment')
          .map((address) => address.address)
      );
    })
    .addEventListener((instance, callback) => {
      return instance.addListener('accountChange', callback);
    })
    .removeEventListener((_, __) => {
      // it will be removed by the main class
    });
export const utxoBuilders = { changeAccountSubscriber };
