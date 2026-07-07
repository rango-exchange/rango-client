import type { SolanaActions } from '@hub3js/solana';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { actions, builders, utils } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

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
  .before(() => {
    solanaOKX().disconnect();
  })
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
