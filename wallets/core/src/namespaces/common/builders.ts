import type { AutoImplementedActionsByRecommended } from './types.js';
import type { Actions } from '../../hub/namespaces/types.js';

import { ActionBuilder } from '../../mod.js';

import { disconnect as disconnectAction } from './actions.js';

export const disconnect = <
  T extends Actions<T> &
    Record<'disconnect', AutoImplementedActionsByRecommended['disconnect']>
>() =>
  new ActionBuilder<AutoImplementedActionsByRecommended, 'disconnect'>(
    'disconnect'
  )
    .after((c) => {
      c;
      //
    })
    .action(disconnectAction) as unknown as ActionBuilder<T, 'disconnect'>;
