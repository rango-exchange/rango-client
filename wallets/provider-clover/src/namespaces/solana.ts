import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { builders } from '@rango-dev/wallets-core/namespaces/solana';

import { solanaActions } from '../actions/solana.js';
import { solanaBuilders } from '../builders/solana.js';
import { WALLET_ID } from '../constants.js';
import { evmClover, solanaClover } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = solanaBuilders
  .changeAccountSubscriber(evmClover, solanaClover)
  .build();

const connect = builders
  .connect()
  .action(solanaActions.connect(solanaClover))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(solanaActions.canEagerConnectAction)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
