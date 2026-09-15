import type { WalletType } from '@hub3js/core';
import type { ProviderInterface } from '@rango-dev/wallets-react';

import { Provider } from '@hub3js/core';

export function isHubWallet(
  wallet: WalletType | ProviderInterface | Provider
): wallet is WalletType | Provider {
  return typeof wallet === 'string' || wallet instanceof Provider;
}
