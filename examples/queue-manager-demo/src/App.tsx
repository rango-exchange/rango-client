import type { Wallet } from './flows/rango/types';
import type { SwapQueueContext } from '@arlert-dev/queue-manager-rango-preset';
import type { Network, WalletType } from '@arlert-dev/wallets-shared';

import { makeQueueDefinition } from '@arlert-dev/queue-manager-rango-preset';
import { Provider as ManagerProvider } from '@arlert-dev/queue-manager-react';
import { useWallets } from '@arlert-dev/wallets-react';
import React, { useMemo } from 'react';

import { FlowsList } from './components/FlowsList';
import { History } from './components/History';
import { Wallets } from './components/Wallets';
import { getConfig } from './configs';
import { meta, metamaskWallet } from './flows/rango/mock';

const wallet: Wallet = metamaskWallet;

interface PropTypes {
  connectedWallets: WalletType[];
}

export function App(props: PropTypes) {
  const {
    providers,
    getSigners,
    state,
    canSwitchNetworkTo,
    connect,
    getWalletInfo,
  } = useWallets();

  const switchNetwork = async (wallet: WalletType, network: Network) => {
    if (!canSwitchNetworkTo(wallet, network)) {
      return undefined;
    }
    return connect(wallet, network);
  };

  const isMobileWallet = (walletType: WalletType): boolean =>
    !!getWalletInfo(walletType).mobileWallet;

  const allProviders = providers();
  const queueContext: SwapQueueContext = {
    meta,
    getSigners,
    wallets: wallet,
    providers: allProviders,
    switchNetwork,
    connect,
    state,
    isMobileWallet,
    canSwitchNetworkTo,
  };

  const swapQueueDef = useMemo(() => {
    return makeQueueDefinition({
      API_KEY: getConfig('API_KEY'),
    });
  }, []);

  return (
    <ManagerProvider queuesDefs={[swapQueueDef]} context={queueContext}>
      <Wallets />
      <h2>Flows</h2>
      <FlowsList connectedWallets={props.connectedWallets} />
      <h2>History</h2>
      <History />
    </ManagerProvider>
  );
}
