import type { UtxoActions } from '@hub3js/bip122';

import { builders } from '@hub3js/bip122';
import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { utxoActions } from '../actions/utxo.js';
import { utxoBuilders } from '../builders/utxo.js';
import { WALLET_ID } from '../constants.js';
import { bitcoinXverse } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = utxoBuilders
  .changeAccountSubscriber(bitcoinXverse)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(utxoActions.canEagerConnect(bitcoinXverse))
  .build();

const connect = builders
  .connect()
  .action(utxoActions.connect())
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .after(changeAccountCleanup)
  .build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
