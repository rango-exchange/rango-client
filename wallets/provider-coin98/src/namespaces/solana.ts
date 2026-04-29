import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  type SolanaActions,
} from '@rango-dev/wallets-core/namespaces/solana';

import { solanaActions } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaCoin98 } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(solanaCoin98)
  /*
   * Coin98 returns EVM addresses on account change instead of Solana addresses even though
   * we are listening to the changes on the Solana instance.
   * But if we get the EVM address, it means that we also have permission to eagerly get
   * the Solana address of the new account.
   */
  .onSwitchAccount(async (event, context) => {
    event.preventDefault();
    if (event.payload && event.payload.length !== 0) {
      context.action('connect');
    } else {
      context.action('disconnect');
    }
  })
  .addEventListener((instance, callback) =>
    instance.on('accountsChanged', callback)
  )
  .removeEventListener((instance, callback) =>
    instance.off('accountsChanged', callback)
  )
  .build();

const connect = builders
  .connect()
  .action(solanaActions.connect(solanaCoin98))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
