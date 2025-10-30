import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  hooks,
} from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmOKX } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(evmOKX);

const connect = builders
  .connect()
  .action(actions.connect(evmOKX))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmOKX))
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmOKX))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .build();

export { evm };
