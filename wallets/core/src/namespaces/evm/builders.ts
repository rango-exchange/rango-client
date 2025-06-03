import type { EvmActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import {
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

export const getInstance = () =>
  new ActionBuilder<EvmActions, 'getInstance'>('getInstance');

export const connect = () =>
  new ActionBuilder<EvmActions, 'connect'>('connect')
    .and(connectAndUpdateStateForMultiNetworks)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<EvmActions, 'canEagerConnect'>('canEagerConnect');

export const signMessage = () =>
  new ActionBuilder<EvmActions, 'signMessage'>('signMessage');

export const sendTransaction = () =>
  new ActionBuilder<EvmActions, 'sendTransaction'>('sendTransaction');

export const getTransaction = () =>
  new ActionBuilder<EvmActions, 'getTransaction'>('getTransaction');
