import type { SolanaActions } from '@hub3js/solana';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import {
  actions,
  builders,
  injectedToWalletStandard,
  solanaKitAdapter,
  utils,
  walletStandardAdapter,
} from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { okx, solanaOKX } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(solanaOKX)
  /*
   * Okx wallet may call the `changeAccount` event with `null` value
   * but we shouldn't disconnect in this case.
   */
  .onSwitchAccount((event) => {
    if (!event.payload) {
      event.preventDefault();
    }
  })
  .format(async (_, event) => {
    // The wallet may emit a `null` value in its `sent` event.
    return utils.formatAccountsToCAIP(event ? [event] : []);
  })
  .build();

const connect = builders
  .connect()
  .action(actions.connect(solanaOKX))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .before(() => {
    solanaOKX().disconnect();
  })
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(actions.canEagerConnect(solanaOKX))
  .build();

/*
 * The wallet's injected Solana provider, wrapped in the Wallet Standard sign
 * features. Unlike the getter `connect` uses, it doesn't throw, so the sign
 * actions report a missing wallet themselves.
 */
const signWallet = () => injectedToWalletStandard(okx()?.get(SOLANA_NAMESPACE));

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
