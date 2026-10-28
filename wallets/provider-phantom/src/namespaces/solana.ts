import type { SolanaActions } from '@hub3js/solana';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import {
  actions,
  builders,
  hooks,
  injectedToWalletStandard,
  solanaKitAdapter,
  walletStandardAdapter,
} from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { phantom, solanaPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(solanaPhantom);

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

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(actions.canEagerConnect(solanaPhantom))
  .build();

/*
 * The wallet's injected Solana provider, wrapped in the Wallet Standard sign
 * features. Unlike the getter `connect` uses, it doesn't throw, so the sign
 * actions report a missing wallet themselves.
 */
const signWallet = () =>
  injectedToWalletStandard(phantom()?.get(SOLANA_NAMESPACE));

// Signs through the wallet, and reads through the Solana RPC URL when one is given.
const buildSolana = (rpcURLs?: string[]) => {
  const builder = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
    .action(connect)
    .action(disconnect)
    .action(canEagerConnect)
    .action(walletStandardAdapter(signWallet));

  const [rpcURL] = rpcURLs ?? [];
  if (rpcURL) {
    builder.action(solanaKitAdapter(rpcURL));
  }

  return builder.build();
};

export { buildSolana };
