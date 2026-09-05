import type { BtcAccount } from '../utils.js';
import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type { Context, FunctionWithContext } from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<UtxoActions['connect'], Context> {
  return async () => {
    const accounts: BtcAccount[] = await instance().requestAccounts();

    return utils.formatAccountsToCAIP(
      accounts
        .filter((account) => account.purpose === 'payment')
        .map((account) => account.address),
      CAIP_BITCOIN_CHAIN_ID
    );
  };
}

export const utxoActions = { connect };
