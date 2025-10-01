import type { ProviderInterface } from '@rango-dev/wallets-react';

import { Provider } from '@rango-dev/wallets-core';

export function hashProviders(
  providers: (string | ProviderInterface | Provider)[]
): string {
  return providers
    .map((provider) => {
      if (typeof provider === 'string') {
        return provider;
      }
      if (provider instanceof Provider) {
        return provider.id;
      }
      return provider.config.type;
    })
    .join('-');
}
