import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type { AnyFunction, Subscriber, SubscriberCleanUp } from '@hub3js/core';

import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

/*
 * Bitget BTC rejects with the generic internal error code, so a rejection is only
 * recognised together with its message.
 */
const INTERNAL_ERROR_CODE = -32603;
const USER_REJECTION_MESSAGE = 'User rejected the request';

function disconnectSubscriber(
  instance: () => ProviderAPI
): [Subscriber<UtxoActions>, SubscriberCleanUp<UtxoActions>] {
  let eventCallback: AnyFunction;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const bitcoinInstance = instance();

      if (!bitcoinInstance) {
        throw new Error(
          'Trying to subscribe to your BTC wallet, but seems its instance is not available.'
        );
      }

      eventCallback = () => {
        context.action('disconnect');
      };
      bitcoinInstance.on('disconnect', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      const bitcoinInstance = instance();

      if (eventCallback && bitcoinInstance) {
        bitcoinInstance.removeListener('disconnect', eventCallback);
      }

      return err;
    },
  ];
}

function convertBitgetUtxoRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    error.code === INTERNAL_ERROR_CODE &&
    error.message === USER_REJECTION_MESSAGE
  ) {
    return Object.assign(new Error(USER_REJECTION_MESSAGE), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}

export const utxoHooks = {
  disconnectSubscriber,
  convertBitgetUtxoRejectionError,
};
