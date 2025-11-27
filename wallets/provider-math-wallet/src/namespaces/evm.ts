import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmMathWallet } from '../utils.js';

const connect = builders
  .connect()
  .action(actions.connect(evmMathWallet))
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmMathWallet))
  .build();

const disconnect = commonBuilders.disconnect<EvmActions>().build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  // Math wallet doesn't support switch network.
  .action(() => false)
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmMathWallet))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(canEagerConnect)
  .action(getChainId)
  .build();

export { evm };
