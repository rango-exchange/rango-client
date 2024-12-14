import type {
  Subscriber,
  SubscriberCleanUp,
} from '@rango-dev/wallets-core/namespaces/common';

import {
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
  type SolanaActions,
} from '@rango-dev/wallets-core/namespaces/solana';
import { AccountId } from 'caip';

import { evmClover, solanaClover } from '../utils.js';

/*
 * The EVM instance is used to listen for the accountsChanged event,
 * because Clover itself did not have a chain change event for the Solana namespace.
 */
export function changeAccountSubscriberAction(): [
  Subscriber<SolanaActions>,
  SubscriberCleanUp<SolanaActions>
] {
  let eventCallback: () => void;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const solanaInstance = solanaClover();
      const evmInstance = evmClover();
      if (!solanaInstance) {
        throw new Error(
          'Trying to subscribe to your Solana wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = async () => {
        const solanaInstance = solanaClover();
        const solanaAccount = await solanaInstance.getAccount();

        setState('accounts', [
          AccountId.format({
            address: solanaAccount,
            chainId: {
              namespace: CAIP_NAMESPACE,
              reference: CAIP_SOLANA_CHAIN_ID,
            },
          }),
        ]);
      };
      evmInstance.on('accountsChanged', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      const evmInstance = evmClover();
      if (eventCallback && evmInstance) {
        evmInstance.removeListener('accountsChanged', eventCallback);
      }

      if (err instanceof Error) {
        throw err;
      }
    },
  ];
}
