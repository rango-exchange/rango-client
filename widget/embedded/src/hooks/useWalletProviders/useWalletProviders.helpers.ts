import type { ProviderInterface } from '@rango-dev/wallets-react';

export function hashProviders(
  providers: (string | ProviderInterface)[]
): string {
  return providers
    .map((provider) => {
      if (typeof provider === 'string') {
        return provider;
      }
      return provider.config.type;
    })
    .join('-');
}
