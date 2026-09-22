import { NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { actions, builders, type SolanaActions } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { throwConnectionError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { solanaMathWallet } from '../utils.js';

const connect = builders
  .connect()
  .action(actions.connect(solanaMathWallet))
  .or(
    throwConnectionError({ walletType: WALLET_ID, namespace: SOLANA_NAMESPACE })
  )
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
