import type { WidgetConfig } from '../types';
import type { ProvidersOptions } from '../utils/providers';
import type { ProviderInterface } from '@rango-dev/wallets-react';

import { useEffect } from 'react';

import { useWalletsStore } from '../store/wallets';
import { matchAndGenerateProviders } from '../utils/providers';

export function useWalletProviders(
  providers: WidgetConfig['wallets'],
  options?: ProvidersOptions
) {
  const clearConnectedWallet = useWalletsStore.use.clearConnectedWallet();
  let generateProviders: ProviderInterface[] = matchAndGenerateProviders(
    providers,
    options
  );

  useEffect(() => {
    clearConnectedWallet();
    generateProviders = matchAndGenerateProviders(providers, options);
  }, [providers?.length]);

  return {
    providers: generateProviders,
  };
}
