import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { builders, hooks } from '@rango-dev/wallets-core/namespaces/solana';

import { solanaActions } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaHooks } from '../hooks/solana.js';
import { solanaSolflare } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(solanaSolflare);

const [disconnectSubscriber, disconnectCleanUp] =
  solanaHooks.getDisconnectSubscriber(solanaSolflare);

const connect = builders
  .connect()
  .action(solanaActions.connect(solanaSolflare))
  .before(changeAccountSubscriber)
  .before(disconnectSubscriber)
  .or(changeAccountCleanup)
  .or(disconnectCleanUp)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .and(disconnectCleanUp)
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(solanaActions.canEagerConnect(solanaSolflare))
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
