import type { ProviderApi } from './types.js';
import type { Subscriber } from '../../hub/namespaces/mod.js';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions.js';

import { CAIP_NAMESPACE, CAIP_SOLANA_CHAIN_ID } from './constants.js';

export const recommended = [...commonRecommended];

export function changeAccountSubscriber(
  instance: () => ProviderApi
): Subscriber {
  return (context) => {
    const solanaInstance = instance();

    if (!solanaInstance) {
      throw new Error(
        'Are your wallet injected correctly and is evm compatible?'
      );
    }

    const [, setState] = context.state();

    solanaInstance.on('accountChanged', (publicKey: any) => {
      setState('accounts', [
        AccountId.format({
          address: publicKey.toString(),
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_SOLANA_CHAIN_ID,
          },
        }),
      ]);
      console.log('[solana] Accounts changed:', publicKey.toString(), {
        context,
      });
    });

    return () => {
      // TODO: Write clean up
    };
  };
}
