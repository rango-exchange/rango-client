import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  utils,
} from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmMetamask } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(evmMetamask)
  /*
   * Metamask returns an array of connected accounts with the active one first.
   * Since we only need the active account, we take the first element as a workaround.
   */
  .format(async (instance, accounts) => {
    const chainId = await instance.request({ method: 'eth_chainId' });
    return utils.formatAccountsToCAIP([accounts[0]], chainId);
  })
  .build();

const connect = new ActionBuilder<EvmActions, 'connect'>('connect')
  .action(actions.connect(evmMetamask))
  /*
   * Metamask Wallet's `connect` returns a list where the currently selected account
   * is always the first item. We're directly taking this first item as the active account.
   *
   * ***NOTE***: Please keep it synced with `wallets/core/src/namespaces/solana/builders.ts`.
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
  .action(actions.canEagerConnect(evmMetamask))
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(canEagerConnect)
  .build();

export { evm };
