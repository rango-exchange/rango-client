import type { SuiActions } from '@rango-dev/wallets-core/namespaces/sui';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/sui';

import { WALLET_ID, WALLET_NAME_IN_WALLET_STANDARD } from '../constants.js';

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

const disconnect = commonBuilders.disconnect<SuiActions>().build();

const sui = new NamespaceBuilder<SuiActions>('Sui', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { sui };
