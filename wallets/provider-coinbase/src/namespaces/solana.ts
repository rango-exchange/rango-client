import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/solana';

import { solanaActions } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaCoinbase } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(solanaCoinbase);

const connect = builders
  .connect()
  .action(actions.connect(solanaCoinbase))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
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
