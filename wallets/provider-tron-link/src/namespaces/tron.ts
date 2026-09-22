import type { Context } from '@hub3js/core';

import { NamespaceBuilder } from '@hub3js/core';
import { TRON_NAMESPACE } from '@hub3js/namespaces';
import * as commonBuilders from '@hub3js/std/builders';
import { throwConnectionError } from '@hub3js/std/operators';
import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import {
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';
import { builders } from '@rango-dev/wallets-core/namespaces/tron';

import { tronActions } from '../actions/tron.js';
import { tronBuilders } from '../builders/tron.js';
import { TronOKRequestCode, WALLET_ID } from '../constants.js';
import { tronHooks } from '../hooks/tron.js';
import { tronTronlink } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = tronBuilders
  .changeAccountSubscriber(tronTronlink)
  .build();

const connect = builders
  .connect()
  .action(async (context: Context) => {
    const instance = tronTronlink();
    const accountsResult = await instance.request({
      method: 'tron_requestAccounts',
    });
    if (!accountsResult) {
      const [getState] = context.state();
      const { accounts, ...state } = getState();
      throw new WalletConnectionError({
        walletType: WALLET_ID,
        namespace: TRON_NAMESPACE,
        type: ConnectionErrorType.Locked,
        state,
      });
    }

    if (
      !!accountsResult?.code &&
      !!accountsResult.message &&
      accountsResult.code !== TronOKRequestCode
    ) {
      throw new Error(accountsResult.message);
    }
    return utils.formatAccountsToCAIP([instance.tronWeb.defaultAddress.base58]);
  })
  .before(changeAccountSubscriber)
  .or(tronHooks.classifyTronLinkConnectionError(TRON_NAMESPACE))
  .or(
    throwConnectionError({ walletType: WALLET_ID, namespace: TRON_NAMESPACE })
  )
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(tronActions.canEagerConnectAction)
  .build();

const disconnect = commonBuilders
  .disconnect<TronActions>()
  .after(changeAccountCleanup)
  .build();

const tron = new NamespaceBuilder<TronActions>('Tron', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { tron };
