import type { StarknetActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import {
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

// Actions
export const connect = () =>
  new ActionBuilder<StarknetActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<StarknetActions, 'canEagerConnect'>('canEagerConnect');
