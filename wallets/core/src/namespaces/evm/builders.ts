import type { EvmActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import {
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

export const connect = () =>
  new ActionBuilder<EvmActions, 'connect'>('connect')
    .and(connectAndUpdateStateForMultiNetworks)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<EvmActions, 'canEagerConnect'>('canEagerConnect');
export const canSwitchNetwork = () =>
  new ActionBuilder<EvmActions, 'canSwitchNetwork'>('canSwitchNetwork');
