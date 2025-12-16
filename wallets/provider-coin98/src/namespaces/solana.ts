import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  type SolanaActions,
} from '@rango-dev/wallets-core/namespaces/solana';

import { connect as solanaConnectAction } from '../actions/solana.js';
import { solanaBuilders } from '../builders/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaCoin98 } from '../helpers.js';

const [changeAccountSubscriber, changeAccountCleanup] = solanaBuilders
  .changeAccountSubscriber(solanaCoin98)
  .build();

const connect = builders
  .connect()
  .action(solanaConnectAction(solanaCoin98))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(actions.canEagerConnect(solanaCoin98))
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
