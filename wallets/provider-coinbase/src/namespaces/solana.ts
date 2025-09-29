import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/solana';

import { solanaActions } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaCoinbase } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(solanaCoinbase)
  .build();

const connect = new ActionBuilder<SolanaActions, 'connect'>('connect')
  .action(actions.connect(solanaCoinbase))
  /*
   * Coinbase Wallet's `connect` returns a list where the currently selected account
   * is always the first item. We're directly taking this first item as the active account.
   */
  .and((_, connectResult) => [connectResult[0]])
  .and(connectAndUpdateStateForSingleNetwork)
  .before(intoConnecting)
  .before(changeAccountSubscriber)
  .after(intoConnectionFinished)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .before(() => {
    /*
     * Coinbase sometimes stays connected and causes the page to refresh.
     * This ensures we also disconnect from the wallet to prevent that behavior.
     */
    solanaCoinbase().disconnect();
  })
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
