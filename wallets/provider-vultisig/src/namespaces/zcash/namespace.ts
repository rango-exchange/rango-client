import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  utils,
  type ZcashActions,
} from '@rango-dev/wallets-core/namespaces/zcash';

import { WALLET_ID } from '../../constants.js';

import { getZcashAccounts, requestZcashAccounts } from './helpers.js';

const connect = builders
  .connect()
  .action(async function () {
    const accounts = await requestZcashAccounts();

    return utils.formatAccountsToCAIP(accounts);
  })
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(async () => {
    const accounts = (await getZcashAccounts()) as string[];
    return accounts.length > 0;
  })
  .build();

const disconnect = commonBuilders.disconnect<ZcashActions>().build();

export const namespace = new NamespaceBuilder<ZcashActions>('ZCASH', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();
