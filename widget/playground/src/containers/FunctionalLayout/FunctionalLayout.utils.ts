import type { MapSupportedList } from '../../components/MultiSelect/MultiSelect.types';
import type { ExtendedWalletInfo } from '@rango-dev/wallets-react';
import type { WalletType, WalletTypes } from '@rango-dev/wallets-shared';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { allProviders as getAllProviders } from '@rango-dev/provider-all';
import { pickVersion, type VersionedProviders } from '@rango-dev/wallets-core';

import { getCategoryNetworks } from '../../utils/blockchains';
import { excludedWallets } from '../../utils/common';

function getProviderId(versionedProvider: VersionedProviders) {
  try {
    const provider = pickVersion(versionedProvider, '1.0.0')[1];
    return provider.id;
  } catch {
    // Fallback to legacy version, if target version doesn't exists.
    const provider = pickVersion(versionedProvider, '0.0.0')[1];
    return provider.config.type;
  }
}

// Considering that the wallets list of the config used for `WidgetProvider` gets filtered by the selected wallets here, we can not directly use `getWalletInfo` of `useWallets` to get the info related to each wallet item because the required provider for an unselected wallet item will not be passed to `Provider`.
export function getWalletsList(
  config: WidgetConfig,
  getWalletInfo: (type: WalletType) => ExtendedWalletInfo
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
  const providersIdList = allBuiltProviders.map(getProviderId);
  const notExcludedProvidersIdList = providersIdList.filter(
    (providerId) => !excludedWallets.includes(providerId as WalletTypes)
  );
  const walletsList: MapSupportedList[] = notExcludedProvidersIdList.map(
    (providerId: string) => {
      const info = getWalletInfo(providerId);
      if (!info) {
        throw new Error('Provider info is not available.');
      }

      return {
        title: info.name,
        logo: info.img,
        name: providerId,
        supportedNetworks: getCategoryNetworks(info.supportedChains),
      };
    }
  );
  return walletsList;
}
