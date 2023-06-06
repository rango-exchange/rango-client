import React, { PropsWithChildren, useMemo } from 'react';
import { Provider as ManagerProvider } from '@rango-dev/queue-manager-react';
import {
  makeQueueDefinition,
  SwapQueueContext,
  checkWaitingForNetworkChange,
  SwapProgressNotification,
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
import Rango from 'rango-types';

// For cjs compatibility.
const { isEvmBlockchain } = Rango;

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
  const getOneOfWalletsDetails = useWalletsStore.use.getOneOfWalletsDetails();

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
  const notifier = (data: SwapProgressNotification) => {
    const lastStep = data.swap?.steps[data.swap.steps.length - 1];
    const outputAmount = data.step?.outputAmount || '';
    const step = data.step || lastStep;

    if (
      data.eventType === 'task_completed' ||
      (data.eventType === 'step_completed_with_output' &&
        lastStep?.id !== data.step?.id) ||
      !!outputAmount
    ) {
      const fromAccount = connectedWallets.find(
        (account) => account.chain === step?.fromBlockchain
      );
      const toAccount =
        step?.fromBlockchain !== step?.toBlockchain &&
        connectedWallets.find((wallet) => wallet.chain === step?.toBlockchain);

      fromAccount && getOneOfWalletsDetails(fromAccount);
      toAccount && getOneOfWalletsDetails(toAccount);
    }
  };

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
    notifier,
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
