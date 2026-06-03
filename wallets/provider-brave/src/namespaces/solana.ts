import type { SolanaActions } from '@hub3js/solana';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { actions, builders, hooks } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { solanaBrave } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(solanaBrave);

const connect = builders
  .connect()
  .action(actions.connect(solanaBrave))
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
  .action(actions.canEagerConnect(solanaBrave))
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
