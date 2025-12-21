import type { TonActions } from './types.js';

import { ActionBuilder } from '../../builders/action.js';
import { intoConnectionFinished } from '../common/after.js';
import { connectAndUpdateStateForSingleNetwork } from '../common/and.js';
import { intoConnecting } from '../common/before.js';

export const connect = () =>
  new ActionBuilder<TonActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<TonActions, 'canEagerConnect'>('canEagerConnect');
