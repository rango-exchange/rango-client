import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  utils,
} from '@rango-dev/wallets-core/namespaces/solana';

import { WALLET_ID } from '../constants.js';
import { solanaOKX } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(solanaOKX)
  /*
   * Okx wallet may call the `changeAccount` event with `null` value
   * but we shouldn't disconnect in this case.
   */
  .onSwitchAccount((event) => {
    if (!event.payload) {
      event.preventDefault();
    }
  })
  .format(async (_, event) => {
    // The wallet may emit a `null` value in its `sent` event.
    return utils.formatAccountsToCAIP(event ? [event] : []);
  })
  .build();

const connect = builders
  .connect()
  .action(actions.connect(solanaOKX))
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
  .action(actions.canEagerConnect(solanaOKX))
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
