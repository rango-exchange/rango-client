import type { UtxoActions } from '@hub3js/bip122';

import { builders } from '@hub3js/bip122';
import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { utxoActions } from '../../actions/utxo.js';
import { WALLET_ID } from '../../constants.js';

const connect = builders
  .connect()
  .action(utxoActions.connect())
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(utxoActions.canEagerConnect())
  .build();

const disconnect = commonBuilders.disconnect<UtxoActions>().build();

export const namespace = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();
