import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmTomo } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(evmTomo)
  .build();

const connect = builders
  .connect()
  .action(actions.connect(evmTomo))
  /*
   * Tomo Wallet's `connect` returns a list where the currently selected account
   * is always the first item. We're directly taking this first item as the active account.
   *
   * ***NOTE***: Please keep it synced with `wallets/core/src/namespaces/evm/builders.ts`.
   *
   */
  .and((_, connectResult) => ({
    ...connectResult,
    accounts: [connectResult.accounts[0]],
  }))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmTomo))
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmTomo))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(canEagerConnect)
  .action(getChainId)
  .build();

export { evm };
