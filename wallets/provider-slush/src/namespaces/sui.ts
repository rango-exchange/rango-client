import type { SuiActions } from '@arlert-dev/wallets-core/namespaces/sui';

import { NamespaceBuilder } from '@arlert-dev/wallets-core';
import { builders as commonBuilders } from '@arlert-dev/wallets-core/namespaces/common';
import { actions, builders } from '@arlert-dev/wallets-core/namespaces/sui';

import { WALLET_ID, WALLET_NAME_IN_WALLET_STANDARD } from '../constants.js';
import { suiWalletInstance } from '../utils.js';

const canEagerConnect = builders
  .canEagerConnect()
  .action(
    actions.canEagerConnect({
      name: WALLET_NAME_IN_WALLET_STANDARD,
    })
  )
  .build();

const connect = builders
  .connect({
    name: WALLET_NAME_IN_WALLET_STANDARD,
  })
  .build();

const disconnect = commonBuilders
  .disconnect<SuiActions>()
  /*
   * This addresses a wallet bug where changing accounts within the app
   *  and then reconnecting results in a connection to the previously connected account.
   *  Explicitly calling `disconnect()` on the wallet instance ensures the wallet
   *  itself is disconnected, allowing for a proper connection to the intended account
   *  upon subsequent reconnection.
   */
  .before(async () => {
    await suiWalletInstance()?.features['standard:disconnect'].disconnect();
  })
  .build();

const sui = new NamespaceBuilder<SuiActions>('Sui', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { sui };
