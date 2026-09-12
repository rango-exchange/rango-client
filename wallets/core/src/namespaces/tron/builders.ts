import type { TronActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import { intoConnectionFinished } from '../common/after.js';
import { connectAndUpdateStateForSingleNetwork } from '../common/and.js';
import { intoConnecting } from '../common/before.js';

export const connect = () =>
  new ActionBuilder<TronActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<TronActions, 'canEagerConnect'>('canEagerConnect');

export const getAllowance = () =>
  new ActionBuilder<TronActions, 'getAllowance'>('getAllowance');

export const buildApproveTransaction = () =>
  new ActionBuilder<TronActions, 'buildApproveTransaction'>(
    'buildApproveTransaction'
  );

export const getTransactionInfo = () =>
  new ActionBuilder<TronActions, 'getTransactionInfo'>('getTransactionInfo');
