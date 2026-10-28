import type { SolanaActions } from '@hub3js/solana';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import {
  builders,
  hooks,
  injectedToWalletStandard,
  solanaKitAdapter,
  walletStandardAdapter,
} from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { solanaActions } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaHooks } from '../hooks/solana.js';
import { solanaSolflare, solflare } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(solanaSolflare);

const [disconnectSubscriber, disconnectCleanUp] =
  solanaHooks.getDisconnectSubscriber(solanaSolflare);

const connect = builders
  .connect()
  .action(solanaActions.connect(solanaSolflare))
  .before(changeAccountSubscriber)
  .before(disconnectSubscriber)
  .or(changeAccountCleanup)
  .or(disconnectCleanUp)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .and(disconnectCleanUp)
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(solanaActions.canEagerConnect(solanaSolflare))
  .build();

/*
 * The wallet's injected Solana provider, wrapped in the Wallet Standard sign
 * features. Unlike the getter `connect` uses, it doesn't throw, so the sign
 * actions report a missing wallet themselves.
 */
const signWallet = () =>
  injectedToWalletStandard(solflare()?.get(SOLANA_NAMESPACE));

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
