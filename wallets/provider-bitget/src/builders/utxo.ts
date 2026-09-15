import type { ProviderAPI } from '@hub3js/bip122';

import { builders, CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  builders
    .changeAccountSubscriber<string>(getInstance, {
      network: CAIP_BITCOIN_CHAIN_ID,
    })
    .onSwitchAccount((event, context) => {
      if (!event.payload) {
        event.preventDefault();
        context.action('disconnect');
      }
    })

    .format(async (_, address) => {
      return utils.formatAccountsToCAIP(
        address ? [address] : [],
        CAIP_BITCOIN_CHAIN_ID
      );
    })
    .addEventListener((instance, callback) => {
      return instance.addListener('accountChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      return instance.removeListener('accountChanged', callback);
    });

export const utxoBuilders = { changeAccountSubscriber };
