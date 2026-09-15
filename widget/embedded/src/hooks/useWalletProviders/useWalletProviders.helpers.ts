import type { Provider } from '@hub3js/core';

export function hashProviders(providers: (string | Provider)[]): string {
  return providers
    .map((provider) => {
      if (typeof provider === 'string') {
        return provider;
      }
      return provider.id;
    })
    .join('-');
}
