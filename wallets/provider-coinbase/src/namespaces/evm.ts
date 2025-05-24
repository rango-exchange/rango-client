import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmCoinbase } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmCoinbase);

const connect = builders
  .connect()
  .action(actions.connect(evmCoinbase))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmCoinbase))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { evm };
