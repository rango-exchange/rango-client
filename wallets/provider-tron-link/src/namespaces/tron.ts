import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  type TronActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/tron';
import { builders } from '@rango-dev/wallets-core/namespaces/tron';

import { tronActions } from '../actions/tron.js';
import { tronBuilders } from '../builders/tron.js';
import { WALLET_ID } from '../constants.js';
import { tronTronlink } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = tronBuilders
  .changeAccountSubscriber(tronTronlink)
  .build();

const connect = builders
  .connect()
  .action(async () => {
    const instance = tronTronlink();
    const accounts: string[] = await instance.request({
      method: 'eth_requestAccounts',
    });
    return utils.formatAccountsToCAIP(accounts);
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
