import type { MapSupportedList } from '../../components/MultiSelect/MultiSelect.types';
import type { Provider } from '@hub3js/core';
import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WidgetConfig } from '@rango-dev/widget-embedded';
import type { BlockchainMeta } from 'rango-sdk';

import { pickVersion, type VersionedProviders } from '@hub3js/core/utils';
import { allProviders as getAllProviders } from '@rango-dev/provider-all';
import { getSupportedChainsFromProvider } from '@rango-dev/wallets-blockchains';

import { getCategoryNetworks } from '../../utils/blockchains';
import { excludedWallets } from '../../utils/common';

// Considering that the wallets list of the config used for `WidgetProvider` gets filtered by the selected wallets here, we can not directly use `getWalletInfo` of `useWallets` to get the info related to each wallet item because the required provider for an unselected wallet item will not be passed to `Provider`.
export function getWalletsList(
  config: WidgetConfig,
  blockchains: BlockchainMeta[]
): MapSupportedList[] {
  const envs = {
    selectedProviders: config.wallets,
    trezor: config?.trezorManifest
      ? { manifest: config.trezorManifest }
      : undefined,
    tonConnect: config?.tonConnect?.manifestUrl
      ? { manifestUrl: config?.tonConnect.manifestUrl }
      : undefined,
  };
  const allProviders = getAllProviders(envs);
  const allBuiltProviders = allProviders.map((build) => build());
  const walletsList: MapSupportedList[] = [];
  allBuiltProviders.forEach((versionedProvider: VersionedProviders) => {
    try {
      /*
       * `pickVersion` can't narrow the value type here, because `VersionedProviders`
       * doesn't carry the version literals of a specific provider.
       */
      const provider = pickVersion(versionedProvider, '1.0.0')[1] as Provider;
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
    } catch {
      // Fallback to legacy version, if target version doesn't exists.
      const provider = pickVersion(
        versionedProvider,
        '0.0.0'
      )[1] as ProviderInterface;
      if (excludedWallets.includes(provider.config.type)) {
        return;
      }
      const walletInfo = provider.getWalletInfo(blockchains);
      walletsList.push({
        title: walletInfo.name,
        logo: walletInfo.img,
        name: provider.config.type,
        supportedNetworks: getCategoryNetworks(walletInfo.supportedChains),
      });
    }
  });

  return walletsList;
}
