import type { EvmActions } from '@arlert-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@arlert-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@arlert-dev/wallets-core/namespaces/common';
import { actions, builders } from '@arlert-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmRabby, switchOrAddNetwork } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmRabby);

const connect = builders
  .connect()
  .action(actions.connect(evmRabby, { switchOrAddNetwork }))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmRabby))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { evm };
