import type { SolanaActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import {
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

export const getInstance = () =>
  new ActionBuilder<SolanaActions, 'getInstance'>('getInstance');

export const connect = () =>
  new ActionBuilder<SolanaActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const signMessage = () =>
  new ActionBuilder<SolanaActions, 'signMessage'>('signMessage');

export const signTransaction = () =>
  new ActionBuilder<SolanaActions, 'signTransaction'>('signTransaction');
