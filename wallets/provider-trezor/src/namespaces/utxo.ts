import type { UtxoActions } from '@hub3js/bip122';

import { builders, CAIP_BITCOIN_CHAIN_ID } from '@hub3js/bip122';
import { NamespaceBuilder } from '@hub3js/core';
import { UTXO_NAMESPACE } from '@hub3js/namespaces';
import * as commonBuilders from '@hub3js/std/builders';
import { throwWalletConnectionError } from '@hub3js/std/operators';

import { utxoActions } from '../actions/utxo.js';
import { WALLET_ID } from '../constants.js';
import { commonHooks } from '../hooks/common.js';

const connect = builders
  .connect()
  .action(utxoActions.connect(CAIP_BITCOIN_CHAIN_ID))
  .or(commonHooks.convertTrezorRejectionError)
  .or(throwWalletConnectionError(UTXO_NAMESPACE))
  .build();

const disconnect = commonBuilders.disconnect<UtxoActions>().build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { utxo };
