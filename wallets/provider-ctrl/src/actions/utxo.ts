import type { Context, FunctionWithContext } from '@hub3js/core';

import { type UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { getAllUtxoAccounts } from '../utils.js';

/**
 * Connect the UTXO namespace across all of Ctrl's UTXO chains at once.
 *
 * Ctrl exposes a separate provider per chain (BTC/LTC/DOGE/BCH), and a UTXO account
 * holds an address on each simultaneously (they're concurrent, not mutually exclusive
 * like EVM networks). So we fetch every available chain's account and return one merged
 * array where each entry is CAIP-encoded with its own `bip122` chain id — letting the
 * single UTXO namespace represent all four chains. Throws only if no chain returns an
 * address.
 */
export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async () => {
    const accounts = await getAllUtxoAccounts();

    if (!accounts.length) {
      throw new Error("Couldn't find any address!");
    }

    return accounts;
  };
}

export const utxoActions = { connect };
