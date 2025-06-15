import type { XRPLActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import {
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

export const connect = () =>
  new ActionBuilder<XRPLActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);
