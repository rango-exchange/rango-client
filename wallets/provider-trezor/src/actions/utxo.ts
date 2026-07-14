import type { Context, FunctionWithContext } from '@hub3js/core';
import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import {
  CAIP_BITCOIN_CHAIN_ID,
  utils,
} from '@rango-dev/wallets-core/namespaces/utxo';

import { initTrezor } from '../init.js';
import {
  getTrezorModule,
  getTrezorNormalizedDerivationPath,
} from '../legacy/helpers.js';
import { setBitcoinDerivationPath } from '../state.js';
import { BITCOIN_COIN_NAME, resolveBitcoinScriptType } from '../utxo/config.js';

/**
 * Connect the Bitcoin account for the selected derivation path: derive the receive
 * address and return it CAIP-encoded with the bip122 Bitcoin chain id. The path is kept
 * (like the EVM namespace does) because Rango's PSBT has no derivation data, so the
 * signer needs it at signing time.
 */
export function connect(): FunctionWithContext<
  UtxoActions['connect'],
  Context
> {
  return async (_context, options) => {
    if (!options?.derivationPath) {
      throw new Error('Derivation Path can not be empty.');
    }

    await initTrezor();

    const path = getTrezorNormalizedDerivationPath(options.derivationPath);
    const inputScriptType = resolveBitcoinScriptType(path);
    setBitcoinDerivationPath(path);

    const TrezorConnect = await getTrezorModule();
    const result = await TrezorConnect.getAddress({
      path,
      coin: BITCOIN_COIN_NAME,
      scriptType: inputScriptType,
      showOnTrezor: false,
    });

    if (!result.success) {
      throw new Error(result.payload.error);
    }

    const { address } = result.payload;

    return utils.formatAccountsToCAIP([address], CAIP_BITCOIN_CHAIN_ID);
  };
}

export const utxoActions = { connect };
