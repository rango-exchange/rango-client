import type {
  CosmosActions,
  ProviderAPI,
} from '@rango-dev/wallets-core/namespaces/cosmos';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import { utils } from '@rango-dev/wallets-core/namespaces/cosmos';

// Hooks
const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<Event, ProviderAPI, CosmosActions>()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      const [getState] = context.state();
      event.preventDefault();
      const connectArgs = getState('connectArgs');
      if (!connectArgs) {
        throw new Error('Connect args are empty');
      }
      context.action('disconnect');
      context.action('connect', connectArgs.options);
    })
    .format(async (_, __) => utils.formatAccountsToCAIP([]))
    .addEventListener((_, callback) => {
      window.addEventListener('keplr_keystorechange', callback);
    })
    .removeEventListener((_, callback) => {
      window.removeEventListener('keplr_keystorechange', callback);
    });

export const cosmosBuilders = { changeAccountSubscriber };
