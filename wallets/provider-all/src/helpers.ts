import type { VersionedProviders } from '@rango-dev/wallets-core/utils';
import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WalletType, WalletTypes } from '@rango-dev/wallets-shared';

import { Provider } from '@rango-dev/wallets-core';

export const isWalletExcluded = (
  providers: (WalletType | ProviderInterface | Provider)[],
  wallet: { name: string; type: WalletTypes }
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
