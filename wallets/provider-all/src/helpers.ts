import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type { WalletType } from '@rango-dev/wallets-shared';

import { WalletTypes } from '@rango-dev/wallets-shared';

export const isWalletConnectExcluded = (
  selectedProviders?: (WalletType | LegacyProviderInterface)[]
) =>
  selectedProviders &&
  !selectedProviders.find((provider) =>
    typeof provider === 'string'
      ? provider === WalletTypes.WALLET_CONNECT_2
      : provider.getWalletInfo([]).name === 'WalletConnect'
  );
