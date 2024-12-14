import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmClover } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmClover);

const [changeChainSubscriber, changeChainCleanup] =
  actions.changeChainSubscriber(evmClover);

const connect = builders
  .connect()
  .action(actions.connect(evmClover))
  .before(changeAccountSubscriber)
  .before(changeChainSubscriber)
  .or(changeAccountCleanup)
  .or(changeChainCleanup)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .after(changeChainCleanup)
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { evm };
