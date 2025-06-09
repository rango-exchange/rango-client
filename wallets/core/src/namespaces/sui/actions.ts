import type { SuiActions } from './types.js';
import type { Subscriber } from '../../hub/namespaces/mod.js';
import type {
  CanEagerConnect,
  SubscriberCleanUp,
} from '../../hub/namespaces/types.js';
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
  let unsubscriber: () => void;

  return [
    (context, err) => {
      const wallet = getInstanceOrThrow(params.name);

      const [, setState] = context.state();
      const eventCallback = (event: StandardEventsChangeProperties) => {
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
      unsubscriber = wallet.features['standard:events'].on(
        'change',
        eventCallback
      );

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      if (unsubscriber) {
        unsubscriber();
      }

      return err;
    },
  ];
}
interface CanEagerConnectParams {
  name: string;
}
export function canEagerConnect(
  params: CanEagerConnectParams
): CanEagerConnect<SuiActions> {
  return async () => {
    const wallet = getInstanceOrThrow(params.name);

    try {
      const connectResult = await wallet.features['standard:connect'].connect({
        silent: true,
      });
      if (connectResult.accounts.length) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
}
