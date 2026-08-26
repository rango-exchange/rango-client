import type { Wallet } from './flows/rango/types';
import type {
  SwapQueueContext,
  TargetNamespace,
  WalletType,
} from '@rango-dev/queue-manager-rango-preset';

import { makeQueueDefinition } from '@rango-dev/queue-manager-rango-preset';
import { Provider as ManagerProvider } from '@rango-dev/queue-manager-react';
import { useWallets } from '@rango-dev/wallets-react';
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
    getSigners,
    state,
    canSwitchNetworkTo,
    connect,
    getWalletInfo,
    hubProvider,
  } = useWallets();

  const switchNetwork = async (
    wallet: WalletType,
    namespace: TargetNamespace
  ) => {
    if (!canSwitchNetworkTo(wallet, namespace.network, namespace)) {
      return undefined;
    }
    return connect(wallet, [namespace]);
  };

  const isMobileWallet = (walletType: WalletType): boolean =>
    !!getWalletInfo(walletType).mobileWallet;

  const queueContext: SwapQueueContext = {
    meta,
    getSigners,
    wallets: wallet,
    switchNetwork,
    state,
    isMobileWallet,
    canSwitchNetworkTo,
    hubProvider,
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
