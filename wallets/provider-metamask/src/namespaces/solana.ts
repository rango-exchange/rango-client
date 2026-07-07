import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { builders, type SolanaActions } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { solanaActions } from '../actions/solana.js';
import { solanaBuilders } from '../builders/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaMetamask } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = solanaBuilders
  .changeAccountSubscriber(solanaMetamask)
  .build();

const connect = builders
  .connect()
  .action(solanaActions.connect(solanaMetamask))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(solanaActions.canEagerConnect(solanaMetamask))
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
