import type { WidgetConfig } from '../../types';
import type { ProvidersOptions } from '../../utils/providers';

import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';
import { matchAndGenerateProviders } from '../../utils/providers';

import { hashProviders } from './useWalletProviders.helpers';

export function useWalletProviders(
  providers: WidgetConfig['wallets'],
  options?: ProvidersOptions
) {
  const { clearConnectedWallet } = useAppStore();
  let generateProviders = matchAndGenerateProviders(providers, options);

  useEffect(() => {
    clearConnectedWallet();
    generateProviders = matchAndGenerateProviders(providers, options);
  }, [
    hashProviders(providers ?? []),
    options?.walletConnectProjectId,
    options?.walletConnectListedDesktopWalletLink,
  ]);

  return {
    providers: generateProviders,
  };
}
