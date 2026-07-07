import type { StellarActions } from '@rango-dev/wallets-core/namespaces/stellar';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import { builders, utils } from '@rango-dev/wallets-core/namespaces/stellar';
import * as freighterApi from '@stellar/freighter-api';

import { WALLET_ID } from '../../constants.js';

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

const balanceLines = builders.balanceLines.build();

const namespace = new NamespaceBuilder<StellarActions>('Stellar', WALLET_ID)
  .action(connect)
  .action(canEagerConnect)
  .action(disconnect)
  .action(balanceLines)
  .build();

export { namespace };
