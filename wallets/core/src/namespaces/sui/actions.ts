import type { SuiActions } from './types.js';
import type { Subscriber } from '../../hub/namespaces/mod.js';
import type { SubscriberCleanUp } from '../../hub/namespaces/types.js';
import type { StandardEventsChangeProperties } from '@mysten/wallet-standard';

import { AccountId } from 'caip';

import { CAIP_NAMESPACE, CAIP_SUI_CHAIN_ID } from './constants.js';
import { getInstanceOrThrow } from './mod.js';

interface ChangeAccountSubscriberParams {
  name: string;
}

export function changeAccountSubscriber(
  params: ChangeAccountSubscriberParams
): [Subscriber<SuiActions>, SubscriberCleanUp<SuiActions>] {
  let eventCallback: (event: StandardEventsChangeProperties) => void;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const wallet = getInstanceOrThrow(params.name);

      const [, setState] = context.state();
      eventCallback = (event) => {
        if (event.accounts) {
          if (event.accounts.length === 0) {
            context.action('disconnect');
          } else {
            setState(
              'accounts',
              event.accounts.map((account) => {
                return AccountId.format({
                  address: account.address,
                  chainId: {
                    namespace: CAIP_NAMESPACE,
                    reference: CAIP_SUI_CHAIN_ID,
                  },
                });
              })
            );
          }
        }
      };
      wallet.features['standard:events'].on('change', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      // TODO: Wallet Standard doesn't have a off method
      if (err instanceof Error) {
        throw err;
      }
    },
  ];
}
