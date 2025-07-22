import type { MapSupportedList } from '../../components/MultiSelect/MultiSelect.types';
import type { WalletTypes } from '@arlert-dev/wallets-shared';
import type { WidgetConfig } from '@arlert-dev/widget-embedded';
import type { BlockchainMeta } from 'rango-sdk';

import { allProviders as getAllProviders } from '@arlert-dev/provider-all';
import { pickVersion, type VersionedProviders } from '@arlert-dev/wallets-core';

import { getCategoryNetworks } from '../../utils/blockchains';
import { excludedWallets } from '../../utils/common';

// Considering that the wallets list of the config used for `WidgetProvider` gets filtered by the selected wallets here, we can not directly use `getWalletInfo` of `useWallets` to get the info related to each wallet item because the required provider for an unselected wallet item will not be passed to `Provider`.
export function getWalletsList(
  config: WidgetConfig,
  blockchains: BlockchainMeta[]
): MapSupportedList[] {
  const envs = {
    walletconnect2: {
      WC_PROJECT_ID: config?.walletConnectProjectId || '',
      DISABLE_MODAL_AND_OPEN_LINK:
        config.__UNSTABLE_OR_INTERNAL__?.walletConnectListedDesktopWalletLink,
    },
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
    let provider;
    try {
      provider = pickVersion(versionedProvider, '1.0.0')[1];
      if (excludedWallets.includes(provider.id as WalletTypes)) {
        return;
      }
      const info = provider.info();
      if (!info) {
        throw new Error('Provider info is not available.');
      }
      const namespacesProperty = info.properties?.find(
        (property) => property.name === 'namespaces'
      );

      const supportedChains =
        namespacesProperty?.value.data.flatMap((namespace) =>
          namespace.getSupportedChains(blockchains || [])
        ) || [];
      walletsList.push({
        title: info.name,
        logo: info.icon,
        name: provider.id,
        supportedNetworks: getCategoryNetworks(supportedChains),
      });
    } catch {
      // Fallback to legacy version, if target version doesn't exists.
      provider = pickVersion(versionedProvider, '0.0.0')[1];
      if (excludedWallets.includes(provider.config.type as WalletTypes)) {
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
