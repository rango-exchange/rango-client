import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  utils,
  type UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';
import { builders } from '@rango-dev/wallets-core/namespaces/utxo';

import { utxoBuilders } from '../builders/utxo.js';
import { WALLET_ID } from '../constants.js';
import { bitcoinOKX, getBitcoinAccounts } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = utxoBuilders
  .changeAccountSubscriber(bitcoinOKX)
  .build();

const canEagerConnect = utxoBuilders.canEagerConnect(bitcoinOKX).build();

const connect = builders
  .connect()
  .action(async function () {
    const accountsResult = await getBitcoinAccounts();

    if (!accountsResult?.address) {
      throw new Error("Couldn't find any address!");
    }
    return utils.formatAccountsToCAIP([accountsResult.address]);
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .before(() => {
    bitcoinOKX().disconnect();
  })
  .after(changeAccountCleanup)
  .build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
