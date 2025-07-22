import type {
  SwapQueueContext,
  TargetNamespace,
} from '@arlert-dev/queue-manager-rango-preset';
import type { WalletType } from '@arlert-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import {
  checkWaitingForNetworkChange,
  makeQueueDefinition,
} from '@arlert-dev/queue-manager-rango-preset';
import { Provider as ManagerProvider } from '@arlert-dev/queue-manager-react';
import { useWallets } from '@arlert-dev/wallets-react';
import { convertEvmBlockchainMetaToEvmChainInfo } from '@arlert-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-types';
import React, { useMemo } from 'react';

import { eventEmitter } from './services/eventEmitter';
import { useAppStore } from './store/AppStore';
import { useUiStore } from './store/ui';
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
      emitter: {
        emit: eventEmitter.emit,
      },
    });
  }, [props.apiKey]);

  const { blockchains, connectedWallets } = useAppStore();
  const blockchainsList = blockchains();

  const wallets = {
    blockchains: connectedWallets.map((wallet) => ({
      accounts: [wallet],
      name: wallet.chain,
    })),
  };

  const switchNetwork = async (
    wallet: WalletType,
    namespace: TargetNamespace
  ) => {
    if (!canSwitchNetworkTo(wallet, namespace.network)) {
      return undefined;
    }
    const result = await connect(wallet, [namespace]);

    return result;
  };

  const isMobileWallet = (walletType: WalletType): boolean =>
    !!getWalletInfo(walletType).mobileWallet;

  // TODO: this code copy & pasted from rango, should be refactored.
  const allBlockchains = blockchainsList
    .filter((blockchain) => blockchain.enabled)
    .reduce(
      (blockchainsObj: any, blockchain) => (
        (blockchainsObj[blockchain.name] = blockchain), blockchainsObj
      ),
      {}
    );
  const evmBasedChains = blockchainsList.filter(isEvmBlockchain);
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
    wallets,
    providers: allProviders,
    switchNetwork,
    canSwitchNetworkTo,
    state,
    isMobileWallet,
  };

  const isActiveTab = useUiStore.use.isActiveTab();

  return (
    <ManagerProvider
      queuesDefs={[swapQueueDef]}
      context={context}
      onPersistedDataLoaded={(manager) => {
        checkWaitingForNetworkChange(manager);
      }}
      isPaused={!isActiveTab}>
      {props.children}
    </ManagerProvider>
  );
}

export default QueueManager;
