import { ProviderInterface } from '@rango-dev/wallets-core';
import { useEffect } from 'react';
import { useWalletsStore } from '../store/wallets';
import { WidgetConfig } from '../types';
import { matchAndGenerateProviders } from '../utils/providers';

export function useWalletProviders(providers: WidgetConfig['wallets']) {
  const clearConnectedWallet = useWalletsStore.use.clearConnectedWallet();
  let generateProviders: ProviderInterface[] =
    matchAndGenerateProviders(providers);

  useEffect(() => {
    clearConnectedWallet();
    generateProviders = matchAndGenerateProviders(providers);
  }, [providers]);

  return {
    providers: generateProviders,
  };
}
