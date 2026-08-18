import type { ProviderAPI, StarknetActions } from '@hub3js/starknet';

import { utils } from '@hub3js/starknet';
import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
// Hooks
export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<string[], ProviderAPI, StarknetActions>()
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
