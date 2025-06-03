import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/solana';

import { WALLET_ID } from '../constants.js';
import { solanaPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(solanaPhantom);

/*
 * TODO: If user imported a private key for EVM, it hasn't solana.
 * when trying to connect to solana for this user we go through `-32603` which is an internal error.
 * If phantom added an specific error code for this situation, we can consider handling the error here.
 * @see https://docs.phantom.app/solana/errors
 */
const connect = builders
  .connect()
  .action(actions.connect(solanaPhantom))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

export const canEagerConnectAction = async () => {
  const solanaInstance = solanaPhantom();

  if (!solanaInstance) {
    throw new Error(
      'Trying to eagerly connect to your Solana wallet, but seems its instance is not available.'
    );
  }

  try {
    const result = await solanaInstance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch {
    return false;
  }
};

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(canEagerConnectAction)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
