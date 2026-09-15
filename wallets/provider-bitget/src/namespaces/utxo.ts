import type { UtxoActions } from '@hub3js/bip122';

import { builders } from '@hub3js/bip122';
import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { utxoActions } from '../actions/utxo.js';
import { utxoBuilders } from '../builders/utxo.js';
import { WALLET_ID } from '../constants.js';
import { utxoHooks } from '../hooks/utxo.js';
import { utxoBitget } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = utxoBuilders
  .changeAccountSubscriber(utxoBitget)
  .build();
const [disconnectSubscriber, disconnectSubscriberCleanup] =
  utxoHooks.disconnectSubscriber(utxoBitget);
const connect = builders
  .connect()
  .action(utxoActions.connect(utxoBitget))
  .before(changeAccountSubscriber)
  .before(disconnectSubscriber)
  .or(changeAccountCleanup)
  .or(disconnectSubscriberCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .after(changeAccountCleanup)
  .after(disconnectSubscriberCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(utxoActions.canEagerConnect(utxoBitget))
  .build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
