import type { SolanaActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import { intoConnectionFinished } from '../common/after.js';
import { connectAndUpdateStateForSingleNetwork } from '../common/and.js';

export const connect = () =>
  new ActionBuilder<SolanaActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .after(intoConnectionFinished);
