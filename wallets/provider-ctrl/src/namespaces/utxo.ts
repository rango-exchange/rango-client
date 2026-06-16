import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import { builders } from '@rango-dev/wallets-core/namespaces/utxo';

import { utxoActions } from '../actions/utxo.js';
import { utxoBuilders } from '../builders/utxo.js';
import { WALLET_ID } from '../constants.js';
import { evmEventSource } from '../utils.js';

/*
 * UTXO account changes are driven by the EVM provider's `accountsChanged` (see
 * builders/utxo.ts) because Ctrl's UTXO providers emit no usable payload. One
 * subscriber, listening on the EVM instance, re-fetches all UTXO chains on a switch
 * and disconnects on empty.
 */
const [changeAccountSubscriber, changeAccountCleanup] = utxoBuilders
  .changeAccountSubscriber(evmEventSource)
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

const canEagerConnect = utxoBuilders.canEagerConnect().build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
