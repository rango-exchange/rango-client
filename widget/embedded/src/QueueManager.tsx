import type {
  SwapQueueContext,
  TargetNamespace,
} from '@rango-dev/queue-manager-rango-preset';
import type { LegacyWalletType as WalletType } from '@rango-dev/wallets-core/legacy';
import type { PropsWithChildren } from 'react';

import { convertEvmBlockchainMetaToEvmChainInfo } from '@rango-dev/internal-blockchains';
import {
  checkWaitingForNetworkChange,
  makeQueueDefinition,
} from '@rango-dev/queue-manager-rango-preset';
import { Provider as ManagerProvider } from '@rango-dev/queue-manager-react';
import { useWallets } from '@rango-dev/wallets-react';
import { isEvmBlockchain } from 'rango-types';
import React, { useMemo } from 'react';

import { eventEmitter } from './services/eventEmitter';
import { useAppStore } from './store/AppStore';
import { useUiStore } from './store/ui';
import { getConfig } from './utils/configs';
import { tryRefineError } from './utils/errors';
import { walletAndSupportedChainsNames } from './utils/wallets';

function QueueManager(props: PropsWithChildren<{ apiKey?: string }>) {
  const {
    getSigners,
    state,
    connect,
    canSwitchNetworkTo,
    getWalletInfo,
    hubProvider,
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
    if (!canSwitchNetworkTo(wallet, namespace.network, namespace)) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const context: SwapQueueContext = {
    meta: {
      blockchains: allBlockchains,
      evmBasedChains: evmBasedChains,
      evmNetworkChainInfo:
        convertEvmBlockchainMetaToEvmChainInfo(evmBasedChains),
      getSupportedChainNames,
    },
    getSigners: async (type: WalletType) => {
      try {
        return await getSigners(type);
      } catch (error) {
        throw tryRefineError(error) ?? error;
      }
    },
    wallets,
    switchNetwork,
    canSwitchNetworkTo,
    state,
    isMobileWallet,
    hubProvider,
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
