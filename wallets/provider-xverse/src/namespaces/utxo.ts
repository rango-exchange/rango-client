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
import { utxoHooks } from '../hooks/utxo.js';
import { bitcoinXverse, getBitcoinAccounts } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = utxoBuilders
  .changeAccountSubscriber(bitcoinXverse)
  .build();

const [disconnectSubscriber, disconnectCleanup] =
  utxoHooks.getDisconnectSubscriber(bitcoinXverse);

const canEagerConnect = utxoBuilders.canEagerConnect(bitcoinXverse).build();

const connect = builders
  .connect()
  .action(async function () {
    const accountsResult = await getBitcoinAccounts();

    if (accountsResult.result?.addresses?.length === 0) {
      throw new Error("Couldn't find any address!");
    }
    return utils.formatAccountsToCAIP(
      accountsResult.result.addresses
        .filter((address) => address.purpose === 'payment')
        .map((address) => address.address)
    );
  })
  .before(changeAccountSubscriber)
  .before(disconnectSubscriber)
  .or(changeAccountCleanup)
  .or(disconnectCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .after(changeAccountCleanup)
  .after(disconnectCleanup)
  .build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
