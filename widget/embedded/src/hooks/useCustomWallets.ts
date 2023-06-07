import { ProviderContext } from '@rango-dev/wallets-core';
import { useWallets } from '@rango-dev/wallets-core';
import { Network, WalletTypes } from '@rango-dev/wallets-shared';
import { useEffect } from 'react';

const useCustomWallets = (manageExternalProviders?: ProviderContext) => {
  const wallets = useWallets();

  const connect = async (type: string, network?: Network) => {
    if (!!manageExternalProviders)
      await manageExternalProviders.connect(type, network);
    return await wallets.connect(type, network);
  };
  const disconnect = (type: string) => {
    wallets.disconnect(type);
    if (!!manageExternalProviders) manageExternalProviders.disconnect(type);
  };
  const disconnectAll = () => {
    wallets.disconnectAll();
    if (!!manageExternalProviders) manageExternalProviders.disconnectAll();
  };

  const state = (type: string) => {
    if (!!manageExternalProviders) {
      console.log('state', manageExternalProviders.state(type));

      return manageExternalProviders.state(type);
    }
    return wallets.state(type);
  };

  useEffect(() => {
    console.log(
      'manage externall wallets',
      manageExternalProviders?.state(WalletTypes.META_MASK)
    );
  }, [manageExternalProviders]);

  return {
    connect,
    disconnect,
    disconnectAll,
    state,
    canSwitchNetworkTo: wallets.canSwitchNetworkTo,
    providers: wallets.providers,
    getSigners: wallets.getSigners,
    getWalletInfo: wallets.getWalletInfo,
  };
};

export default useCustomWallets;
