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
    .or(intoConnectionFinished)
    .after(intoConnectionFinished);
