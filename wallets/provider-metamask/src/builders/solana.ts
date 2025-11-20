import type { WalletStandardSolanaInstance } from '../types.js';
import type { StandardEventsChangeProperties } from '@wallet-standard/features';

import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import { utils } from '@rango-dev/wallets-core/namespaces/solana';

// Hooks
const changeAccountSubscriber = (
  getInstance: () => WalletStandardSolanaInstance
) =>
  new ChangeAccountSubscriberBuilder<
    StandardEventsChangeProperties,
    WalletStandardSolanaInstance
  >()
    .getInstance(getInstance)
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
    .addEventListener((instance, callback) => {
      instance.features['standard:events'].on('change', callback);
    })
    .removeEventListener((_, __) => {});

export const solanaBuilders = { changeAccountSubscriber };
