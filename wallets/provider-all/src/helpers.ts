import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WalletType } from '@rango-dev/wallets-shared';

import { WalletTypes } from '@rango-dev/wallets-shared';

export const isWalletConnectExcluded = (
  selectedProviders?: (WalletType | ProviderInterface)[]
) =>
  selectedProviders &&
  !selectedProviders.find((provider) =>
    typeof provider === 'string'
      ? provider === WalletTypes.WALLET_CONNECT_2
      : provider.getWalletInfo([]).name === 'WalletConnect'
  );
