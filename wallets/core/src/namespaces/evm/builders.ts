import type { EvmActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import { intoConnectionFinished } from '../common/after.js';
import { connectAndUpdateStateForMultiNetworks } from '../common/and.js';

export const connect = () =>
  new ActionBuilder<EvmActions, 'connect'>('connect')
    .and(connectAndUpdateStateForMultiNetworks)
    .after(intoConnectionFinished);
