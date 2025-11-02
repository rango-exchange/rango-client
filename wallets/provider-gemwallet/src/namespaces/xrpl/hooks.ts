import type { XRPLActions } from '@rango-dev/wallets-core/namespaces/xrpl';

import { on } from '@gemwallet/api';
import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import { utils } from '@rango-dev/wallets-core/namespaces/xrpl';

type WalletChangedEventPayload = {
  wallet: {
    publicAddress: string;
  };
};

export function changeAccountSubscriberBuilder() {
  // `true` instead of ProviderAPI is just a workaround. we don't need to have instance here.
  return new ChangeAccountSubscriberBuilder<WalletChangedEventPayload, true>()
    .getInstance(() => true)
    .format(async (_, payload) => [
      utils.formatAddressToCAIP(payload.wallet.publicAddress),
    ])
    .addEventListener((_, callback) => {
      on('walletChanged', callback);
    })
    .removeEventListener((_instance, _callback) => {
      /*
       * TODO: gem wallet doesn't have support for unsubscribing.
       * Making a variable and keep the callback refrence then here make it `undefined` is a quick fix
       * but it makes new bugs, where if two subscribers added at once, we will loose the track of the first one and it will be staled.
       */
    })
    .build<XRPLActions>();
}
