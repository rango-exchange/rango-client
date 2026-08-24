import type { VersionedProviders } from '@hub3js/core/utils';
import type { LegacyWalletType as WalletType } from '@rango-dev/wallets-core/legacy';
import type { ProviderInterface } from '@rango-dev/wallets-react';

import { Provider } from '@hub3js/core';

export const isWalletExcluded = (
  providers: (WalletType | ProviderInterface | Provider)[],
  wallet: { name: string; type: WalletType }
) => {
  return (
    providers.length &&
    !providers.find((provider) => {
      if (typeof provider === 'string') {
        return provider === wallet.type;
      }
      if (provider instanceof Provider) {
        return provider.id === wallet.type;
      }
      return provider.getWalletInfo([]).name === wallet.name;
    })
  );
};

export const lazyProvider = (provider: VersionedProviders) => () => provider;
