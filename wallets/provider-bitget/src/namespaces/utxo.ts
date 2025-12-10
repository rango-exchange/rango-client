import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { builders } from '@rango-dev/wallets-core/namespaces/utxo';

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

const canEagerConnect = utxoBuilders.canEagerConnect(utxoBitget).build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
