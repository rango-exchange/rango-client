import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';

import { XVERSE_ACCESS_DENIED_ERROR_CODE } from '../constants.js';
import { getBitcoinAccounts } from '../utils.js';

export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async () => {
    const accountsResult = await getBitcoinAccounts();

    if (accountsResult.result?.addresses?.length === 0) {
      throw new Error("Couldn't find any address!");
    }

    return utils.formatAccountsToCAIP(
      accountsResult.result.addresses.map((address) => address.address),
      CAIP_BITCOIN_CHAIN_ID
    );
  };
}

// No silent connect: ask for addresses and read the access-denied code instead.
export function canEagerConnect(
  instance: () => ProviderAPI
): CanEagerConnect<UtxoActions> {
  return async () => {
    try {
      const addressesResponse = await instance().request('getAddresses', {
        purposes: ['payment'],
      });

      if (addressesResponse.error?.code === XVERSE_ACCESS_DENIED_ERROR_CODE) {
        return false;
      }

      return !!addressesResponse.result?.addresses?.length;
    } catch {
      return false;
    }
  };
}

export const utxoActions = { connect, canEagerConnect };
