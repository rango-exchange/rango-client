import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, type SolanaActions } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { solanaMathWallet } from '../utils.js';

const connect = builders
  .connect()
  .action(actions.connect(solanaMathWallet))
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
