import type { TonActions } from '@rango-dev/wallets-core/namespaces/ton';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { builders } from '@rango-dev/wallets-core/namespaces/ton';

import { tonActions } from '../actions/ton.js';
import { WALLET_ID } from '../constants.js';
import { tonHooks } from '../hooks/ton.js';
import { tonConnect } from '../utils.js';

const [disconnectSubscriber, disconnectCleanUp] =
  tonHooks.getDisconnectSubscriber(tonConnect.getInstance.bind(tonConnect));

const connect = builders
  .connect()
  .action(tonActions.connect(tonConnect.getInstance.bind(tonConnect)))
  .and(disconnectSubscriber)
  .or(disconnectCleanUp)
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(tonActions.canEagerConnect(tonConnect.getInstance.bind(tonConnect)))
  .build();

const disconnect = commonBuilders
  .disconnect<TonActions>()
  .before(tonHooks.handleProviderDisconnect)
  .after(disconnectCleanUp)
  .build();

const ton = new NamespaceBuilder<TonActions>('Ton', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { ton };
