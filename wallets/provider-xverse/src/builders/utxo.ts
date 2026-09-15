import type { XVerseEvent } from '../types.js';
import type { ProviderAPI } from '@hub3js/bip122';

import { builders, CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  builders
    .changeAccountSubscriber<XVerseEvent>(getInstance, {
      network: CAIP_BITCOIN_CHAIN_ID,
    })
    /*
     * Xverse wallet may call the `changeAccount` event with `empty` value
     * but we shouldn't disconnect in this case.
     */
    .onSwitchAccount((event) => {
      if (!event.payload?.addresses?.length) {
        event.preventDefault();
      }
    })
    .format(async (_, event) => {
      return utils.formatAccountsToCAIP(
        event.addresses
          .filter((address) => address.purpose === 'payment')
          .map((address) => address.address),
        CAIP_BITCOIN_CHAIN_ID
      );
    })
    .addEventListener((instance, callback) => {
      return instance.addListener('accountChange', callback);
    })
    .removeEventListener((_, __) => {
      // it will be removed by the main class
    });

export const utxoBuilders = { changeAccountSubscriber };
