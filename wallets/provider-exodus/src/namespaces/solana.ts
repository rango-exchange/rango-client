import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions as evmActions } from '@rango-dev/wallets-core/namespaces/evm';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/solana';

import { WALLET_ID } from '../constants.js';
import { evmExodus, solanaExodus } from '../utils.js';

const connect = builders
  .connect()
  .action(actions.connect(solanaExodus))
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  /*
   * Exodus does not provide an eager connection mechanism for its Solana wallet.
   * The only workaround is to use the EVM-based eager connect approach.
   * However, this will only work if the EVM namespace has been connected at least once before.
   * If either wallet instance is unavailable, we throw an error.
   */
  .action(() => evmActions.canEagerConnect(evmExodus))
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
