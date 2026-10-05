import type { LedgerSolanaWallet } from '../types.js';
import type { Context } from '@hub3js/core';
import type { StandardEventsChangeProperties } from '@wallet-standard/features';

import { NamespaceBuilder } from '@hub3js/core';
import { builders, type SolanaActions, utils } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { getSolanaWallet } from '../ledgerProvider.js';

/*
 * The Ledger Button keeps a single selected account across all chains. When the
 * user picks a non-Solana account, the wallet clears its Solana accounts and
 * emits `change` with an empty list, which we treat as a disconnect.
 */
const [changeAccountSubscriber, changeAccountCleanup] =
  new ChangeAccountSubscriberBuilder<
    StandardEventsChangeProperties,
    LedgerSolanaWallet,
    SolanaActions
  >()
    .getInstance(getSolanaWallet)
    .onSwitchAccount((event, context) => {
      if (!event.payload.accounts?.length) {
        context.action('disconnect');
        event.preventDefault();
      }
    })
    .format(async (_, event) =>
      utils.formatAccountsToCAIP(
        event.accounts!.map((account) => account.address)
      )
    )
    /*
     * Wallet Standard has no `off`; `on` returns the unsubscribe function,
     * which the builder calls on cleanup.
     */
    .addEventListener((instance, callback) =>
      instance.features['standard:events'].on('change', callback)
    )
    .removeEventListener((_, __) => {})
    .build();

const connect = builders
  .connect()
  .action(async (_context: Context<SolanaActions>) => {
    const { accounts } = await getSolanaWallet().features[
      'standard:connect'
    ].connect();

    return utils.formatAccountsToCAIP(
      accounts.map((account) => account.address)
    );
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  /*
   * Tell the Ledger wallet to clear its announced accounts so a later
   * reconnect starts clean. It must never make our own disconnect flow fail,
   * hence the guard.
   */
  .before(async () => {
    try {
      await getSolanaWallet().features['standard:disconnect'].disconnect();
    } catch (error) {
      console.error('[ledger-wallet] solana disconnect failed', error);
    }
  })
  .after(changeAccountCleanup)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
