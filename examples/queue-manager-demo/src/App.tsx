import React, { useMemo } from 'react';
import { Provider as ManagerProvider } from '@yeager-dev/queue-manager-react';
import { FlowsList } from './components/FlowsList';
import { meta } from './flows/rango/mock';
import { useWallets } from '@yeager-dev/wallets-react';
import { metamaskWallet } from './flows/rango/mock';
import { Wallet } from './flows/rango/types';
import { Network, WalletType } from '@yeager-dev/wallets-shared';
import { Wallets } from './components/Wallets';
import { History } from './components/History';
import {
  SwapQueueContext,
  makeQueueDefinition,
} from '@yeager-dev/queue-manager-rango-preset';
import { getConfig } from './configs';
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

  const switchNetwork = (wallet: WalletType, network: Network) => {
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
