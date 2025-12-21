import type { TonActions } from '@rango-dev/wallets-core/namespaces/ton';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import { standardizeAndThrowError } from '@rango-dev/wallets-core/namespaces/common';
import { builders } from '@rango-dev/wallets-core/namespaces/ton';

import { tonActions } from '../actions/ton.js';
import { tonBuilders } from '../builders/ton.js';
import { WALLET_ID } from '../constants.js';
import { tonConnect } from '../helpers.js';

const [changeAccountSubscriber, changeAccountCleanup] = tonBuilders
  .changeAccountSubscriber(tonConnect)
  .build();

const connect = builders
  .connect()
  .action(tonActions.connect(tonConnect))
  .and(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(tonActions.canEagerConnect(tonConnect))
  .build();

const disconnect = new ActionBuilder<TonActions, 'disconnect'>('disconnect')
  .action(tonActions.disconnect(tonConnect))
  .after(changeAccountCleanup)
  .build();

const ton = new NamespaceBuilder<TonActions>('Ton', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { ton };
