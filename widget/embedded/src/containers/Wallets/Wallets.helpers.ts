import type { OnUpdateState } from './Wallets.types';
import type { EventHandler } from '@rango-dev/wallets-react';

import { Events } from '@rango-dev/wallets-react';

/*
 * propagate updates for Dapps using external wallets
 *
 * Note: to take more control over the public interface and `@hub3js/core` interface (which may be changed) we use this layer
 */
export function propagateEvents(
  cb: OnUpdateState,
  eventParams: Parameters<EventHandler>
): void {
  const [walletType, event, value, coreState, info] = eventParams;

  // PROVIDER_DISCONNECTED is used only by the hub, so it isn't propagated to lib users.
  if (event === Events.PROVIDER_DISCONNECTED) {
    return;
  }

  cb(walletType, event, value, coreState, info);
}
