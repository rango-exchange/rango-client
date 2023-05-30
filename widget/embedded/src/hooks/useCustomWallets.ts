import { ProviderContext } from '@rango-dev/wallets-core';
import { useWallets } from '@rango-dev/wallets-core';
import { Network } from '@rango-dev/wallets-shared';

const useCustomWallets = (manageExternalWallets?: () => ProviderContext) => {
  const wallets = useWallets();
  const manageWallets = manageExternalWallets && manageExternalWallets();
  console.log('manage externall wallets', manageWallets);

  const connect = async (type: string, network?: Network) => {
    if (!!manageWallets) return await manageWallets.connect(type, network);
    return await wallets.connect(type, network);
  };
  const disconnect = (type: string) => {
    wallets.disconnect(type);
    if (!!manageWallets) manageWallets.disconnect(type);
  };
  const disconnectAll = () => {
    wallets.disconnectAll();
    if (!!manageWallets) manageWallets.disconnectAll();
  };

  const state = (type: string) => {
    if (!!manageWallets) {
      console.log('state', manageWallets.state(type));

      return manageWallets.state(type);
    }
    return wallets.state(type);
  };
  const canSwitchNetworkTo = (type: string, network: Network) => {
    if (!!manageWallets) return manageWallets.canSwitchNetworkTo(type, network);
    return wallets.canSwitchNetworkTo(type, network);
  };

  const providers = () => {
    if (!!manageWallets) return manageWallets.providers();
    return wallets.providers();
  };

  const getSigners = (type: string) => {
    if (!!manageWallets) return manageWallets.getSigners(type);
    return wallets.getSigners(type);
  };

  const getWalletInfo = (type: string) => {
    if (!!manageWallets) return manageWallets.getWalletInfo(type);
    return wallets.getWalletInfo(type);
  };

  return {
    connect,
    disconnect,
    disconnectAll,
    state,
    canSwitchNetworkTo,
    providers,
    getSigners,
    getWalletInfo,
  };
};

export default useCustomWallets;
