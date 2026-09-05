import type { UtxoActions } from '@hub3js/bip122';

import { builders } from '@hub3js/bip122';
import { NamespaceBuilder } from '@hub3js/core';
import { actions as solanaActions } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { utxoActions } from '../actions/utxo.js';
import { utxoBuilders } from '../builders/utxo.js';
import { WALLET_ID } from '../constants.js';
import { bitcoinPhantom, solanaPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = utxoBuilders
  .changeAccountSubscriber(bitcoinPhantom)
  .build();

const connect = builders
  .connect()
  .action(utxoActions.connect(bitcoinPhantom))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .after(changeAccountCleanup)
  .build();

/*
 * TODO: We are currently using `solanaCanEagerConnectAction` to establish an eager connection to the BTC instance.
 * This is a temporary workaround due to Phantom's limitation in silently connecting to a BTC account.
 * Once Phantom introduces support for silent BTC connections, this implementation should be updated accordingly.
 */
const canEagerConnect = builders
  .canEagerConnect()
  .action(solanaActions.canEagerConnect(solanaPhantom))
  .build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
