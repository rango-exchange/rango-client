import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';

import { ActionBuilder } from '@hub3js/core';
import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import { type UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { getAllUtxoAccounts } from '../utils.js';

/**
 * Ctrl switches the active account across all chains at once, but its UTXO providers
 * emit an empty `accountsChanged` payload (`{}`) and re-fetching them while
 * disconnected opens a wallet popup — so they can't drive the update themselves. The
 * EVM provider, however, emits a proper `accountsChanged`: a non-empty array on
 * switch and an empty array on disconnect. We therefore drive UTXO off the EVM
 * signal: re-fetch all UTXO chains on a switch (silent while connected), and
 * disconnect WITHOUT re-fetching (so no popup) when EVM reports empty.
 */
export const changeAccountSubscriber = (
  getInstance: () => EvmProviderApi
): ChangeAccountSubscriberBuilder<string[], EvmProviderApi, UtxoActions> =>
  new ChangeAccountSubscriberBuilder<string[], EvmProviderApi, UtxoActions>()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      if (!event.payload?.length) {
        context.action('disconnect');
        event.preventDefault();
      }
    })
    .format(async () => getAllUtxoAccounts())
    .addEventListener((instance, callback) => {
      instance.on?.('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.removeListener?.('accountsChanged', callback);
    });

function canEagerConnect() {
  return new ActionBuilder<UtxoActions, 'canEagerConnect'>(
    'canEagerConnect'
  ).action(async () => {
    const accounts = await getAllUtxoAccounts().catch(() => []);
    return accounts.length > 0;
  });
}

export const utxoBuilders = { changeAccountSubscriber, canEagerConnect };
