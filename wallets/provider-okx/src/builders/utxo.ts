import type { OkxBtcAddress } from '../types.js';
import type { ProviderAPI } from '@hub3js/bip122';

import { builders, CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  builders
    .changeAccountSubscriber<OkxBtcAddress>(getInstance, {
      network: CAIP_BITCOIN_CHAIN_ID,
    })
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
      return utils.formatAccountsToCAIP(
        event ? [event.address] : [],
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
