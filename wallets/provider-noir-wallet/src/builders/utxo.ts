import { CAIP_ZCASH_CHAIN_ID, utils, type UtxoActions } from '@hub3js/bip122';
import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import { type NoirWalletProvider, type ZcashAccount } from '@noir-wallet/sdk';

import { getInstanceOrThrow } from '../utils.js';

export const changeAccountSubscriberBuilder = () => {
  return new ChangeAccountSubscriberBuilder<
    ZcashAccount['addresses'] | null,
    NoirWalletProvider,
    UtxoActions
  >()
    .getInstance(getInstanceOrThrow)
    .onSwitchAccount((event, context) => {
      if (!event.payload?.transparent) {
        void context.action('disconnect');
        event.preventDefault();
        return;
      }
    })
    .format(async (_, payload) =>
      utils.formatAccountsToCAIP(
        payload?.transparent ? [payload.transparent] : [],
        CAIP_ZCASH_CHAIN_ID
      )
    )
    .addEventListener((instance, callback) => {
      instance.zcash.on('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.zcash.removeListener('accountsChanged', callback);
    });
};
