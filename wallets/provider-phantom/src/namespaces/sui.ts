import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';
import type { SuiActions } from '@rango-dev/wallets-core/namespaces/sui';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions as solanaActions } from '@rango-dev/wallets-core/namespaces/solana';
import { builders, hooks } from '@rango-dev/wallets-core/namespaces/sui';

import { WALLET_ID, WALLET_NAME_IN_WALLET_STANDARD } from '../constants.js';
import { solanaPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber({
    name: WALLET_NAME_IN_WALLET_STANDARD,
  });

const connect = builders
  .connect({
    name: WALLET_NAME_IN_WALLET_STANDARD,
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SuiActions>()
  .after(changeAccountCleanup)
  .build();

/*
 * TODO: We are currently using `solanaCanEagerConnectAction` to establish an eager connection to the Sui instance.
 * This is a temporary workaround due to Phantom's limitation in silently connecting to a Sui account.
 * Once Phantom introduces support for silent Sui connections, this implementation should be updated accordingly.
 */
const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(solanaActions.canEagerConnect(solanaPhantom))
  .build();

const sui = new NamespaceBuilder<SuiActions>('Sui', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { sui };
