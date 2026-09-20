import type { InternalEvent, OnUpdateState } from './Wallets.types';
import type { EventHandler, Events } from '@rango-dev/wallets-react';

import { INTERNAL_EVENTS } from './Wallets.constants';

function isInternalEvent(event: Events): event is InternalEvent {
  return (INTERNAL_EVENTS as readonly Events[]).includes(event);
}

/*
 * propagate updates for Dapps using external wallets
 *
 * Note: to take more control over the public interface and wallets-core interface (which may be changed) we use this layer
 */
export function propagateEvents(
  cb: OnUpdateState,
  eventParams: Parameters<EventHandler>
): void {
  const [walletType, event, value, coreState, info] = eventParams;

  if (isInternalEvent(event)) {
    return;
  }

  cb(walletType, event, value, coreState, info);
}
