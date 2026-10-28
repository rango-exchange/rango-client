import type { ProviderAPI, SolanaActions } from '@hub3js/solana';

import { NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import {
  builders,
  injectedToWalletStandard,
  solanaKitAdapter,
  walletStandardAdapter,
} from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { solanaActions } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { coin98, solanaCoin98 } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(solanaCoin98)
  /*
   * Coin98 returns EVM addresses on account change instead of Solana addresses even though
   * we are listening to the changes on the Solana instance.
   * But if we get the EVM address, it means that we also have permission to eagerly get
   * the Solana address of the new account.
   */
  .onSwitchAccount(async (event, context) => {
    event.preventDefault();
    if (event.payload && event.payload.length !== 0) {
      context.action('connect');
    } else {
      context.action('disconnect');
    }
  })
  .addEventListener((instance, callback) =>
    instance.on('accountsChanged', callback)
  )
  .removeEventListener((instance, callback) =>
    instance.off('accountsChanged', callback)
  )
  .build();

const connect = builders
  .connect()
  .action(solanaActions.connect(solanaCoin98))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

/*
 * The wallet's injected Solana provider, wrapped in the Wallet Standard sign
 * features. Unlike the getter `connect` uses, it doesn't throw, so the sign
 * actions report a missing wallet themselves.
 */
const signWallet = () =>
  injectedToWalletStandard(
    coin98()?.get(SOLANA_NAMESPACE) as ProviderAPI | undefined
  );

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
