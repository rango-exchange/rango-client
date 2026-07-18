import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import {
  type ProviderAPI,
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<string[], ProviderAPI, TronActions>()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      if (!event.payload?.length) {
        event.preventDefault();
        context.action('disconnect');
      }
    })
    .format(async (_, accounts) => utils.formatAccountsToCAIP(accounts))
    .addEventListener((instance, callback) => {
      instance.on('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.off('accountsChanged', callback);
    });

export const tronBuilders = { changeAccountSubscriber };
