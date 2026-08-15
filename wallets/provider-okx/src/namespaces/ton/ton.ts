import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  builders,
  type TonActions,
} from '@rango-dev/wallets-core/namespaces/ton';

import { tonActions } from '../../actions/ton.js';
import { tonBuilders } from '../../builders/ton.js';
import { WALLET_ID } from '../../constants.js';
import { tonOKX } from '../../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = tonBuilders
  .changeAccountSubscriber(tonOKX)
  .build();

const [walletDisconnectSubscriber, walletDisconnectCleanup] = tonBuilders
  .disconnectSubscriber(tonOKX)
  .build();

const connect = builders
  .connect()
  .action(tonActions.connect(tonOKX))
  .before(changeAccountSubscriber)
  .before(walletDisconnectSubscriber)
  .or(walletDisconnectCleanup)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<TonActions>()
  .before(tonActions.disconnect(tonOKX))
  .after(changeAccountCleanup)
  .after(walletDisconnectCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(tonActions.canEagerConnect(tonOKX))
  .build();

const ton = new NamespaceBuilder<TonActions>('Ton', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { ton };
