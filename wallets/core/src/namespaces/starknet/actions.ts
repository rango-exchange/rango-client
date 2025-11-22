import type { ProviderAPI } from './types.js';

import { recommended as commonRecommended } from '../common/actions.js';

export const recommended = [...commonRecommended];

export function canEagerConnect(instance: () => ProviderAPI) {
  return async () => {
    const starknetInstance = instance();

    if (!starknetInstance) {
      throw new Error(
        'Trying to eagerly connect to your Starknet wallet, but seems its instance is not available.'
      );
    }

    return starknetInstance.isPreauthorized();
  };
}
