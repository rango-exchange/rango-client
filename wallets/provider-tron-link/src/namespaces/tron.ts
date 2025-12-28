import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';
import { builders } from '@rango-dev/wallets-core/namespaces/tron';

import { tronActions } from '../actions/tron.js';
import { tronBuilders } from '../builders/tron.js';
import { TronOKRequestCode, WALLET_ID } from '../constants.js';
import { tronTronlink } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = tronBuilders
  .changeAccountSubscriber(tronTronlink)
  .build();

const connect = builders
  .connect()
  .action(async () => {
    const instance = tronTronlink();
    const accountsResult = await instance.request({
      method: 'tron_requestAccounts',
    });
    if (!accountsResult) {
      throw new Error('Please unlock your TronLink extension first.');
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
  .or(standardizeAndThrowError)
  .or(changeAccountCleanup)
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
