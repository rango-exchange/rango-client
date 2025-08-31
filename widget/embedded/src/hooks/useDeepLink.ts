import type { InstallObjects } from '@rango-dev/wallets-shared';

import { useWallets } from '@rango-dev/wallets-react';
import { detectMobileScreens } from '@rango-dev/wallets-shared';

import { useAppStore } from '../store/AppStore';

export function useDeepLink() {
  const { getWalletInfo } = useWallets();
  const { config } = useAppStore();
  const isMobileScreen = detectMobileScreens();

  function getWalletDeepLink(walletType: string): string | undefined {
    const wallet = getWalletInfo(walletType);
    const appHost = config.deepLinking?.appHost;
    const targetUrl = config.deepLinking?.targetUrl;
    if (!appHost || !targetUrl) {
      return;
    }
    return wallet.generateDeepLink?.({
      appHost,
      targetUrl,
    });
  }

  /**
   * Returns the appropriate wallet link based on the given wallet type.
   *
   * If a deep link is available and the user is on a mobile screen, the deep link is returned.
   * Otherwise, it falls back to returning the wallet's install link.
   *
   * @param {string} walletType - The type of the wallet (e.g., 'metamask', 'trust-wallet').
   * @returns {string | InstallObjects} - A deep link string if available on mobile, or an install link object otherwise.
   */
  function getWalletLink(walletType: string): string | InstallObjects {
    const deepLink = getWalletDeepLink(walletType);
    if (deepLink && isMobileScreen) {
      return deepLink;
    }
    const wallet = getWalletInfo(walletType);
    return wallet.installLink;
  }

  function checkHasDeepLink(walletType: string): boolean {
    return !!getWalletDeepLink(walletType) && isMobileScreen;
  }
  return { getWalletDeepLink, getWalletLink, checkHasDeepLink };
}
