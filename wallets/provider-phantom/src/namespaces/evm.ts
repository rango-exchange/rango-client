import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmPhantom);

const connect = builders
  .connect()
  .action(actions.connect(evmPhantom))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const evm = new NamespaceBuilder<EvmActions>('evm', WALLET_ID)
  .action('init', () => {
    console.log('[phantom]init called from evm cb');
  })
  .action(connect)
  .action(disconnect)
  .build();

export { evm };
