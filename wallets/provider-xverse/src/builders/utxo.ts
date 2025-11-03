import type { XVerseEvent } from '../types.js';

import { ActionBuilder } from '@rango-dev/wallets-core';
import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import {
  type ProviderAPI,
  utils,
  type UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

import { XVERSE_ACCESS_DENIED_ERROR_CODE } from '../constants.js';

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

function canEagerConnect(getInstance: () => ProviderAPI) {
  return new ActionBuilder<UtxoActions, 'canEagerConnect'>(
    'canEagerConnect'
  ).action(async () => {
    const instance = getInstance();
    try {
      const addressesResponse = await instance.request('getAddresses', {
        purposes: ['payment'],
      });
      if (addressesResponse.error?.code === XVERSE_ACCESS_DENIED_ERROR_CODE) {
        return false;
      }
      return !!addressesResponse.result?.addresses?.length;
    } catch {
      return false;
    }
  });
}

export const utxoBuilders = { changeAccountSubscriber, canEagerConnect };
