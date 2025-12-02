import type { OkxBtcAddress } from '../types.js';

import { ActionBuilder } from '@rango-dev/wallets-core';
import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import {
  type ProviderAPI,
  utils,
  type UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<OkxBtcAddress, ProviderAPI, UtxoActions>()
    .getInstance(getInstance)
    /*
     * Okx wallet may call the `changeAccount` event with `null` value
     * but we shouldn't disconnect in this case.
     */
    .onSwitchAccount((event) => {
      if (!event.payload?.address) {
        event.preventDefault();
      }
    })

    .format(async (_, event) => {
      return utils.formatAccountsToCAIP(event ? [event.address] : []);
    })
    .addEventListener((instance, callback) => {
      return instance.addListener('accountChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      return instance.removeListener('accountChanged', callback);
    });

function canEagerConnect(getInstance: () => ProviderAPI) {
  return new ActionBuilder<UtxoActions, 'canEagerConnect'>(
    'canEagerConnect'
  ).action(async () => {
    const instance = getInstance();
    try {
      const accounts = await instance.getAccounts();
      return !!accounts.length;
    } catch {
      return false;
    }
  });
}

export const utxoBuilders = { changeAccountSubscriber, canEagerConnect };
