import type { PlaygroundConfig } from '../store/config';
import type { Provider } from '@hub3js/core';

import { allProviders } from '@rango-dev/provider-all';

import { initialConfig } from '../store/config';

import { getProvidersOptions } from './walletsSetup';

let providers: Provider[] | undefined;

// Providers hold state, so they're built once for the whole playground session.
export function getProviders(): Provider[] {
  if (!providers) {
    providers = allProviders(getProvidersOptions(initialConfig)).map((build) =>
      build()
    );
  }
  return providers;
}

export function selectProviders(config: PlaygroundConfig): Provider[] {
  return getProviders().filter(
    (provider) => !config.wallets || config.wallets.includes(provider.id)
  );
}
