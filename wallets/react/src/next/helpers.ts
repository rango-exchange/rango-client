import type { V1, VLegacy } from '@rango-dev/wallets-core';

import { Provider } from '@rango-dev/wallets-core';

export function isNextProvider(provider: VLegacy | V1): provider is V1 {
  return provider instanceof Provider;
}

export function isLegacyProvider(provider: VLegacy | V1): provider is VLegacy {
  return !isNextProvider(provider);
}
