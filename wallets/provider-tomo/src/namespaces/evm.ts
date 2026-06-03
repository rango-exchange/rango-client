import type { EvmActions } from '@hub3js/evm';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { actions, builders } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import {
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { evmTomo } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(evmTomo)
  .build();

const connect = new ActionBuilder<EvmActions, 'connect'>('connect')
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
  .and(connectAndUpdateStateForMultiNetworks)
  .before(intoConnecting)
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .after(intoConnectionFinished)
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
