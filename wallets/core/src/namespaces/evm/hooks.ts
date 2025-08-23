import type { EIP1193EventMap } from './eip1193.js';
import type { EvmActions, ProviderAPI } from './types.js';
import type { Subscriber, SubscriberCleanUp } from '../../mod.js';

import { builders } from './mod.js';

export function changeAccountSubscriber(
  instance: () => ProviderAPI
): [Subscriber<EvmActions>, SubscriberCleanUp<EvmActions>] {
  return builders.changeAccountSubscriber(instance).build();
}

export function changeChainSubscriber(
  instance: () => ProviderAPI
): [Subscriber<EvmActions>, SubscriberCleanUp<EvmActions>] {
  let eventCallback: EIP1193EventMap['chainChanged'];

  return [
    (context) => {
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Trying to subscribe to your EVM wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = async (chainId: string) => {
        setState('network', chainId);
      };
      evmInstance.on('chainChanged', eventCallback);
    },
    () => {
      const evmInstance = instance();

      if (eventCallback && evmInstance) {
        evmInstance.removeListener('chainChanged', eventCallback);
      }
    },
  ];
}
