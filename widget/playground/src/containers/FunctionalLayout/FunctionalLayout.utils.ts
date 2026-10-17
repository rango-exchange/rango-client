import type { MapSupportedList } from '../../components/MultiSelect/MultiSelect.types';
import type { Provider } from '@hub3js/core';
import type { BlockchainMeta } from 'rango-sdk';

import { getSupportedChainsFromProvider } from '@rango-dev/internal-blockchains';
import { allProviders as getAllProviders } from '@rango-dev/provider-all';

import { getCategoryNetworks } from '../../utils/blockchains';
import { excludedWallets } from '../../utils/common';

// Considering that the wallets list of the config used for `WidgetProvider` gets filtered by the selected wallets here, we can not directly use `getWalletInfo` of `useWallets` to get the info related to each wallet item because the required provider for an unselected wallet item will not be passed to `Provider`.
export function getWalletsList(
  blockchains: BlockchainMeta[]
): MapSupportedList[] {
  const allProviders = getAllProviders();
  const allBuiltProviders = allProviders.map((build) => build());
  const walletsList: MapSupportedList[] = [];
  allBuiltProviders.forEach((provider: Provider) => {
    if (excludedWallets.includes(provider.id)) {
      return;
    }

    const info = provider.info();
    if (!info) {
      throw new Error('Provider info is not available.');
    }

    const supportedChains = getSupportedChainsFromProvider(
      provider,
      blockchains
    );
    walletsList.push({
      title: info.metadata.name,
      logo: info.metadata.icon,
      name: provider.id,
      supportedNetworks: getCategoryNetworks(supportedChains),
    });
  });

  return walletsList;
}
