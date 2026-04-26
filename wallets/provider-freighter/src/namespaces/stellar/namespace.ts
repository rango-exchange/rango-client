import type { StellarActions } from '@rango-dev/wallets-core/namespaces/stellar';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { builders, utils } from '@rango-dev/wallets-core/namespaces/stellar';
import * as freighterApi from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

import { HORIZON_URL, WALLET_ID } from '../../constants.js';

import { changeAccountSubscriberBuilder } from './hooks.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  changeAccountSubscriberBuilder();

const connect = builders
  .connect()
  .action(async function () {
    const result = await freighterApi.requestAccess();

    if (result.error) {
      throw result.error;
    }

    return [utils.formatAddressToCAIP(result.address)];
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = new ActionBuilder<StellarActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(async function () {
    const result = await freighterApi.getAddress();
    return !!result.address;
  })
  .build();

const disconnect = commonBuilders
  .disconnect<StellarActions>()
  .after(changeAccountCleanup)
  .build();

const accountLines = new ActionBuilder<StellarActions, 'accountLines'>(
  'accountLines'
)
  .action(async function (_, accountId: string) {
    const server = new StellarSdk.Horizon.Server(HORIZON_URL);
    const account = await server.loadAccount(accountId);

    const nonNativeBalances = account.balances.filter(
      (balance) =>
        balance.asset_type !== 'native' &&
        balance.asset_type !== 'liquidity_pool_shares'
    );

    const trustLines = nonNativeBalances.map((balance) => {
      return {
        code: balance.asset_code,
        issuer: balance.asset_issuer,
        limit: balance.limit,
      };
    });

    return trustLines;
  })
  .build();

const namespace = new NamespaceBuilder<StellarActions>('Stellar', WALLET_ID)
  .action(connect)
  .action(canEagerConnect)
  .action(disconnect)
  .action(accountLines)
  .build();

export { namespace };
