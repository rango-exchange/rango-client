import type { SwapQueueContext } from '@yeager-dev/queue-manager-rango-preset';
import type { Network, WalletType } from '@yeager-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import {
  checkWaitingForNetworkChange,
  makeQueueDefinition,
} from '@yeager-dev/queue-manager-rango-preset';
import { Provider as ManagerProvider } from '@yeager-dev/queue-manager-react';
import { useWallets } from '@yeager-dev/wallets-react';
import { convertEvmBlockchainMetaToEvmChainInfo } from '@yeager-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-types';
import React, { useMemo } from 'react';

import { useAppStore } from './store/AppStore';
import { useWalletsStore } from './store/wallets';
import { getConfig } from './utils/configs';
import { walletAndSupportedChainsNames } from './utils/wallets';

function QueueManager(props: PropsWithChildren<{ apiKey?: string }>) {
  const {
    providers,
    getSigners,
    state,
    connect,
    canSwitchNetworkTo,
    getWalletInfo,
  } = useWallets();

  const swapQueueDef = useMemo(() => {
    return makeQueueDefinition({
      API_KEY: props.apiKey || getConfig('API_KEY'),
      BASE_URL: getConfig('BASE_URL'),
    });
  }, [props.apiKey]);

  const blockchains = useAppStore().blockchains();
  const connectedWallets = useWalletsStore.use.connectedWallets();

  const wallets = {
    blockchains: connectedWallets.map((wallet) => ({
      accounts: [wallet],
      name: wallet.chain,
    })),
  };

  const switchNetwork = async (wallet: WalletType, network: Network) => {
    if (!canSwitchNetworkTo(wallet, network)) {
      return undefined;
    }
    return connect(wallet, network);
  };

  const isMobileWallet = (walletType: WalletType): boolean =>
    !!getWalletInfo(walletType).mobileWallet;

  // TODO: this code copy & pasted from rango, should be refactored.
  const allBlockchains = blockchains
    .filter((blockchain) => blockchain.enabled)
    .reduce(
      (blockchainsObj: any, blockchain) => (
        (blockchainsObj[blockchain.name] = blockchain), blockchainsObj
      ),
      {}
    );
  const evmBasedChains = blockchains.filter(isEvmBlockchain);
  const getSupportedChainNames = (type: WalletType) => {
    const { supportedChains } = getWalletInfo(type);
    return walletAndSupportedChainsNames(supportedChains);
  };
  const allProviders = providers();

  const context: SwapQueueContext = {
    meta: {
      blockchains: allBlockchains,
      evmBasedChains: evmBasedChains,
      evmNetworkChainInfo:
        convertEvmBlockchainMetaToEvmChainInfo(evmBasedChains),
      getSupportedChainNames,
    },
    getSigners,
    //todo: remove Network type
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    wallets,
    providers: allProviders,
    switchNetwork,
    canSwitchNetworkTo,
    connect,
    state,
    isMobileWallet,
  };

  return (
    <ManagerProvider
      queuesDefs={[swapQueueDef]}
      context={context}
      onPersistedDataLoaded={(manager) => {
        checkWaitingForNetworkChange(manager);
      }}
      isPaused={false}>
      {props.children}
    </ManagerProvider>
  );
}

export default QueueManager;
