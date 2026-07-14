import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import { builders } from '@rango-dev/wallets-core/namespaces/utxo';

import { utxoActions } from '../actions/utxo.js';
import { WALLET_ID } from '../constants.js';

const connect = builders
  .connect()
  .action(utxoActions.connect())
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders.disconnect<UtxoActions>().build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { utxo };
