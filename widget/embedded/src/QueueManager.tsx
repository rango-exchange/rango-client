import React, { PropsWithChildren, useMemo } from 'react';
import { Provider as ManagerProvider } from '@rango-dev/queue-manager-react';
import {
  makeQueueDefinition,
  SwapQueueContext,
  checkWaitingForNetworkChange,
} from '@rango-dev/queue-manager-rango-preset';
import { useWallets } from '@rango-dev/wallets-core';
import {
  convertEvmBlockchainMetaToEvmChainInfo,
  Network,
  WalletType,
} from '@rango-dev/wallets-shared';
import { useMetaStore } from './store/meta';
import { useWalletsStore } from './store/wallets';
import { walletAndSupportedChainsNames } from './utils/wallets';
import { getConfig } from './utils/configs';
import { isEvmBlockchain } from 'rango-types';

function QueueManager(props: PropsWithChildren) {
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
      API_KEY: getConfig('API_KEY'),
    });
  }, []);

  const { blockchains } = useMetaStore.use.meta();
  const connectedWallets = useWalletsStore.use.connectedWallets();

  const wallets = {
    blockchains: connectedWallets.map((wallet) => ({
      accounts: [wallet],
      name: wallet.chain,
    })),
  };

  const switchNetwork = (wallet: WalletType, network: Network) => {
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
