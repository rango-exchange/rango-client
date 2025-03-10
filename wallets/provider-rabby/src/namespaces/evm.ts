import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmRabby } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmRabby);

const connect = builders
  .connect()
  .action(actions.connect(evmRabby))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { evm };
