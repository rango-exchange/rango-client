import type { StellarActions } from '@rango-dev/wallets-core/namespaces/stellar';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import { utils } from '@rango-dev/wallets-core/namespaces/stellar';
import { WatchWalletChanges } from '@stellar/freighter-api';

const WATCH_WALLET_INTERVAL = 1000; // how often you want to check for changes in the wallet

export function changeAccountSubscriberBuilder() {
  return new ChangeAccountSubscriberBuilder<
    { address: string },
    WatchWalletChanges,
    StellarActions
  >()
    .getInstance(() => new WatchWalletChanges(WATCH_WALLET_INTERVAL))
    .format(async (_, payload) => [utils.formatAddressToCAIP(payload.address)])
    .addEventListener((instance, callback) => {
      instance.watch(callback);
    })
    .onSwitchAccount((event, context) => {
      if (!event.payload.address) {
        context.action('disconnect');
        event.preventDefault();
      }
    })
    .removeEventListener((instance) => {
      instance.stop();
    })
    .build();
}
