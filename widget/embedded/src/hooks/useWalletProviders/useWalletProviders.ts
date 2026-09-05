import type { WidgetConfigWithoutLegacyProviders } from '../../types';
import type { ProvidersOptions } from '../../utils/providers';

import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';

import { hashProviders } from './useWalletProviders.helpers';

export function useWalletProviders(
  configWallets: WidgetConfigWithoutLegacyProviders['wallets'],
  options?: ProvidersOptions
) {
  const { clearConnectedWallet, getAvailableProviders, buildAndSetProviders } =
    useAppStore();
  const providers = getAvailableProviders();

  useEffect(() => {
    clearConnectedWallet();
    buildAndSetProviders();
  }, [
    hashProviders(configWallets ?? []),
    options?.walletConnectProjectId,
    options?.walletConnectListedDesktopWalletLink,
  ]);

  return {
    providers,
  };
}
