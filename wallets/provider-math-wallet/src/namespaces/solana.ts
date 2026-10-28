import type { SolanaActions } from '@hub3js/solana';

import { NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import {
  actions,
  builders,
  injectedToWalletStandard,
  solanaKitAdapter,
  walletStandardAdapter,
} from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { solanaHooks } from '../hooks/solana.js';
import { mathWallet, solanaMathWallet } from '../utils.js';

const connect = builders
  .connect()
  .action(actions.connect(solanaMathWallet))
  .or(solanaHooks.convertRejectionError)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

/*
 * The wallet's injected Solana provider, wrapped in the Wallet Standard sign
 * features. Unlike the getter `connect` uses, it doesn't throw, so the sign
 * actions report a missing wallet themselves.
 */
const signWallet = () =>
  injectedToWalletStandard(mathWallet()?.get(SOLANA_NAMESPACE));

// Signs through the wallet, and reads through the Solana RPC URL when one is given.
const buildSolana = (rpcURLs?: string[]) => {
  const builder = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
    .action(connect)
    .action(disconnect)
    .action(walletStandardAdapter(signWallet));

  const [rpcURL] = rpcURLs ?? [];
  if (rpcURL) {
    builder.action(solanaKitAdapter(rpcURL));
  }

  return builder.build();
};

export { buildSolana };
