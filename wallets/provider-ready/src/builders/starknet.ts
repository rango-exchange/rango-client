import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/starknet';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import { utils } from '@rango-dev/wallets-core/namespaces/starknet';
// Hooks
export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<string[], ProviderAPI>()
    .getInstance(getInstance)

    .onSwitchAccount((event) => {
      if (!event.payload.length) {
        event.preventDefault();
      }
    })
    .format(async (_, accounts) => utils.formatAccountsToCAIP(accounts))
    .addEventListener((instance, callback) => {
      instance.on('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.off('accountsChanged', callback);
    });

export const starknetBuilders = { changeAccountSubscriber };
