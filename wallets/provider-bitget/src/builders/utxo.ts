import { ActionBuilder } from '@rango-dev/wallets-core';
import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import {
  type ProviderAPI,
  utils,
  type UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<string, ProviderAPI, UtxoActions>()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      if (!event.payload) {
        event.preventDefault();
        context.action('disconnect');
      }
    })

    .format(async (_, address) => {
      return utils.formatAccountsToCAIP(address ? [address] : []);
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
    const accounts = await instance.getAccounts();
    return !!accounts.length;
  });
}

export const utxoBuilders = { changeAccountSubscriber, canEagerConnect };
