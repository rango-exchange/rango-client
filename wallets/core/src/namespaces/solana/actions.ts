import type { NamespaceProvider } from './types';
import type { SubscriberCb } from '../../hub/namespace';

import { AccountId } from 'caip';

import { recommended as commonRecommended } from '../common/actions';

export const recommended = [...commonRecommended];

export function changeAccountSubscriber(
  instance: () => NamespaceProvider
): SubscriberCb {
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
          // TODO: export from core
          chainId: {
            namespace: 'solana',
            reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
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
