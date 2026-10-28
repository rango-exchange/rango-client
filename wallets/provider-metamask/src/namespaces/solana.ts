import type { SolanaActions, SolanaSignWallet } from '@hub3js/solana';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import {
  builders,
  solanaKitAdapter,
  walletStandardAdapter,
} from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { solanaActions } from '../actions/solana.js';
import { solanaBuilders } from '../builders/solana.js';
import { WALLET_ID } from '../constants.js';
import { metamask, solanaMetamask } from '../utils.js';

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

/*
 * MetaMask registers its Solana wallet through Wallet Standard, so the sign
 * actions use it as it is.
 */
const signWallet = () =>
  metamask()?.get(SOLANA_NAMESPACE) as SolanaSignWallet | undefined;

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
