import type { SolanaActions } from '@hub3js/solana';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import {
  actions,
  builders,
  injectedToWalletStandard,
  solanaKitAdapter,
  walletStandardAdapter,
} from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import {
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@hub3js/std/operators';

import { solanaActions } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { coinbase, solanaCoinbase } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(solanaCoinbase)
  .build();

const connect = new ActionBuilder<SolanaActions, 'connect'>('connect')
  .action(actions.connect(solanaCoinbase))
  /*
   * Coinbase Wallet's `connect` returns a list where the currently selected account
   * is always the first item. We're directly taking this first item as the active account.
   */
  .and((_, connectResult) => [connectResult[0]])
  .and(connectAndUpdateStateForSingleNetwork)
  .before(intoConnecting)
  .before(changeAccountSubscriber)
  .after(intoConnectionFinished)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .before(() => {
    /*
     * Coinbase sometimes stays connected and causes the page to refresh.
     * This ensures we also disconnect from the wallet to prevent that behavior.
     */
    solanaCoinbase().disconnect();
  })
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(solanaActions.canEagerConnectAction)
  .build();

/*
 * The wallet's injected Solana provider, wrapped in the Wallet Standard sign
 * features. Unlike the getter `connect` uses, it doesn't throw, so the sign
 * actions report a missing wallet themselves.
 */
const signWallet = () =>
  injectedToWalletStandard(coinbase()?.get(SOLANA_NAMESPACE));

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
