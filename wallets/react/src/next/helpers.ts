import type {
  LegacyProviderInterface,
  NextProviderInterface,
} from '@rango-dev/wallets-core';

import { Provider } from '@rango-dev/wallets-core';

export function isNextProvider(
  provider: LegacyProviderInterface | NextProviderInterface
): provider is NextProviderInterface {
  return provider instanceof Provider;
}

export function isLegacyProvider(
  provider: LegacyProviderInterface | NextProviderInterface
): provider is LegacyProviderInterface {
  return !isNextProvider(provider);
}
