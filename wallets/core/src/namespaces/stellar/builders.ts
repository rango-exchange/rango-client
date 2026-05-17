import type { StellarActions } from './types.js';

import * as StellarSdk from '@stellar/stellar-sdk';

import { ActionBuilder } from '../../mod.js';
import {
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

import { HORIZON_URL } from './constants.js';

export const connect = () =>
  new ActionBuilder<StellarActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const balanceLines = new ActionBuilder<StellarActions, 'balanceLines'>(
  'balanceLines'
).action(async function (_, accountId: string) {
  const server = new StellarSdk.Horizon.Server(HORIZON_URL);
  const account = await server.loadAccount(accountId);

  return account.balances;
});
