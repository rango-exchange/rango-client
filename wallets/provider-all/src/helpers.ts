import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WalletType, WalletTypes } from '@rango-dev/wallets-shared';

export const isWalletTypeExcluded = (
  walletType: WalletTypes,
  walletName: string,
  selectedProviders?: (WalletType | ProviderInterface)[]
) => {
  return (
    selectedProviders &&
    !selectedProviders.find((provider) =>
      typeof provider === 'string'
        ? provider === walletType
        : provider.getWalletInfo([]).name === walletName
    )
  );
};
