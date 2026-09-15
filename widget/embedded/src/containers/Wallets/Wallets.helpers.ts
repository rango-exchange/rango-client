import type { OnUpdateState } from './Wallets.types';
import type { EventHandler } from '@rango-dev/wallets-react';

import { Events } from '@rango-dev/wallets-react';

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

  /*
   * PROVIDER_DISCONNECTED has conflict with WalletEventTypes.DISCONNECT since they are doing samething, the first one is using only for Hub, the second one is what we exposed to the lib users.
   * so for backward-compat we need to keep the behavior of WalletEventTypes.DISCONNECT
   */
  if (event === Events.PROVIDER_DISCONNECTED) {
    return;
  }

  cb(walletType, event, value, coreState, info);
}
