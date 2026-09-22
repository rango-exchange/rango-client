import type { ProviderAPI, UtxoActions } from '@hub3js/bip122';
import type {
  AnyFunction,
  Context,
  Subscriber,
  SubscriberCleanUp,
} from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';

import { WALLET_ID } from '../constants.js';

// Bitget reports a UTXO rejection with the generic JSON-RPC internal error code, so its message is matched too.
const BITGET_UTXO_REJECTION_CODE = -32603;
const BITGET_UTXO_REJECTION_MESSAGE = 'User rejected the request';

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

function classifyBitgetConnectionError(namespace: string) {
  return (context: Context, error: unknown): unknown => {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      error.code !== BITGET_UTXO_REJECTION_CODE ||
      !('message' in error) ||
      error.message !== BITGET_UTXO_REJECTION_MESSAGE
    ) {
      return error;
    }

    const [getState] = context.state();
    const { accounts, ...state } = getState();

    return new WalletConnectionError({
      walletType: WALLET_ID,
      namespace,
      type: ConnectionErrorType.Rejected,
      state,
      cause: error,
    });
  };
}

export const utxoHooks = {
  disconnectSubscriber,
  classifyBitgetConnectionError,
};
