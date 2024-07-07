import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WalletType, WalletTypes } from '@rango-dev/wallets-shared';

export const isWalletExcluded = (
  providers: (WalletType | ProviderInterface)[],
  wallet: { name: string; type: WalletTypes }
) => {
  return (
    providers.length &&
    !providers.find((provider) =>
      typeof provider === 'string'
        ? provider === wallet.type
        : provider.getWalletInfo([]).name === wallet.name
    )
  );
};
