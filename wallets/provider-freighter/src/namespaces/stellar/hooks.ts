import type { StellarActions } from '@hub3js/stellar';

import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { utils } from '@hub3js/stellar';
import { WatchWalletChanges } from '@stellar/freighter-api';

const WATCH_WALLET_INTERVAL = 1000; // how often you want to check for changes in the wallet
const FREIGHTER_USER_REJECTION_CODE = -4;

export function changeAccountSubscriberBuilder() {
  return new ChangeAccountSubscriberBuilder<
    { address: string },
    WatchWalletChanges,
    StellarActions
  >()
    .getInstance(() => new WatchWalletChanges(WATCH_WALLET_INTERVAL))
    .format(async (_, payload) => [utils.formatAddressToCAIP(payload.address)])
    .addEventListener((instance, callback) => {
      instance.watch(callback);
    })
    .onSwitchAccount((event, context) => {
      if (!event.payload.address) {
        context.action('disconnect');
        event.preventDefault();
      }
    })
    .removeEventListener((instance) => {
      instance.stop();
    })
    .build();
}

export function convertFreighterRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === FREIGHTER_USER_REJECTION_CODE
  ) {
    const message =
      'message' in error && error.message !== undefined
        ? String(error.message)
        : undefined;
    return Object.assign(new Error(message), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}
