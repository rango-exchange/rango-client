import type { BtcAccount } from '../utils.js';
import type { ProviderAPI } from '@hub3js/bip122';

import { builders, CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  builders
    .changeAccountSubscriber<BtcAccount[]>(getInstance, {
      network: CAIP_BITCOIN_CHAIN_ID,
    })
    .format(async (_, accounts) =>
      utils.formatAccountsToCAIP(
        accounts
          .filter((account) => account.purpose === 'payment')
          .map((account) => account.address),
        CAIP_BITCOIN_CHAIN_ID
      )
    );

export const utxoBuilders = { changeAccountSubscriber };
