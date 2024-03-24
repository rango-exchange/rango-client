import type {
  ProviderInterface,
  ProviderV1Interface,
} from '@rango-dev/wallets-core';

import { Provider } from '@rango-dev/wallets-core';

export function isV1Provider(
  provider: ProviderInterface | ProviderV1Interface
): provider is ProviderV1Interface {
  return provider instanceof Provider;
}

export function isV0Provider(
  provider: ProviderInterface | ProviderV1Interface
): provider is ProviderInterface {
  return !isV1Provider(provider);
}
