import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmPhantom);

/*
 * TODO: If user imported a private key for EVM, it hasn't solana.
 * when trying to connect to solana for this user we go through `-32603` which is an internal error.
 * If phantom added an specific error code for this situation, we can consider handling the error here.
 * @see https://docs.phantom.app/solana/errors
 */
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

const canEagerConnect = new ActionBuilder<EvmActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(async function () {
    /*
     * TODO: This function is copied from `canEagerlyConnectToEvm` of "@rango-dev/wallets-shared"
     * to not pass meta to this function and try make hub decoupled from legacyProvider.
     * This can be moved to EVMActions
     */
    const instance = evmPhantom();
    try {
      const accounts: string[] = await instance.request({
        method: 'eth_accounts',
      });
      if (accounts.length) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  })
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { evm };
