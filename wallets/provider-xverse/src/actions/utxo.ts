import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type {
  CanEagerConnect,
  Context,
  FunctionWithContext,
} from '@hub3js/core';

import { CAIP_BITCOIN_CHAIN_ID, utils } from '@hub3js/bip122';
import { getErrorMessage, Hub3Error } from '@hub3js/core';

import {
  XVERSE_ACCESS_DENIED_ERROR_CODE,
  XVERSE_REJECTION_MESSAGE,
} from '../constants.js';
import { getBitcoinAccounts } from '../utils.js';

export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async () => {
    try {
      const accountsResult = await getBitcoinAccounts();

      if (accountsResult.error?.message) {
        const type =
          accountsResult.error.message === XVERSE_REJECTION_MESSAGE
            ? 'PROVIDER_USER_REJECTED_REQUEST'
            : 'PROVIDER_UNEXPECTED';
        throw new Hub3Error(type, accountsResult.error.message, {
          cause: accountsResult,
        });
      }

      if (accountsResult.result?.addresses?.length === 0) {
        throw new Hub3Error(
          'PROVIDER_UNEXPECTED',
          "Couldn't find any address!",
          { cause: accountsResult }
        );
      }

      return utils.formatAccountsToCAIP(
        accountsResult.result.addresses.map((address) => address.address),
        CAIP_BITCOIN_CHAIN_ID
      );
    } catch (error) {
      if (error instanceof Hub3Error) {
        throw error;
      }
      if (
        error instanceof Error &&
        error.message === XVERSE_REJECTION_MESSAGE
      ) {
        throw new Hub3Error(
          'PROVIDER_USER_REJECTED_REQUEST',
          getErrorMessage(error),
          { cause: error }
        );
      }
      throw error;
    }
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
