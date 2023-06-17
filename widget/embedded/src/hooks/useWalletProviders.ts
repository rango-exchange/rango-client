import { ProviderInterface } from '@rango-dev/wallets-core';
import { useEffect } from 'react';
import { useWalletsStore } from '../store/wallets';
import { WidgetConfig } from '../types';
import { matchAndGenerateProviders } from '../utils/providers';

export function useWalletProviders(config: WidgetConfig['wallets']) {
  const clearConnectedWallet = useWalletsStore.use.clearConnectedWallet();
  let providers: ProviderInterface[] = matchAndGenerateProviders(config);

  useEffect(() => {
    clearConnectedWallet();
    providers = matchAndGenerateProviders(config);
  }, [config]);

  return {
    providers,
  };
}
