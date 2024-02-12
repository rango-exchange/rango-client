import type { WidgetConfig } from '../types';
import type { WalletInfo } from '@rango-dev/ui';
import type { BlockchainMeta } from 'rango-sdk';

import { WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import {
  KEPLR_COMPATIBLE_WALLETS,
  type WalletType,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { useCallback, useEffect, useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { useWalletsStore } from '../store/wallets';
import { configWalletsToWalletName } from '../utils/providers';
import {
  hashWalletsState,
  isExperimentalChain,
  mapWalletTypesToWalletInfo,
  sortWalletsBasedOnConnectionState,
} from '../utils/wallets';

const ALL_SUPPORTED_WALLETS = Object.values(WalletTypes);

interface Params {
  config?: WidgetConfig;
  chain?: string;
  onBeforeConnect?: (walletType: string) => void;
  onConnect?: (walletType: string) => void;
}

/**
 * gets list of wallets with their information and an action for handling click callback fo UI
 * we need to share the logic of rendering list of wallets and handle clicking on them in different places
 * you can use this list whenever you need to show the list of wallets and needed callbacks
 */
export function useWalletList(params: Params) {
  const { config, chain, onBeforeConnect, onConnect } = params;
  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const { connectedWallets } = useWalletsStore();
  const blockchains = useAppStore().blockchains();

  /** It can be what has been set by widget config or as a fallback we use all the supported wallets by our library */
  const listAvailableWalletTypes =
    configWalletsToWalletName(config?.wallets, {
      walletConnectProjectId: config?.walletConnectProjectId,
    }) || ALL_SUPPORTED_WALLETS;

  const wallets = mapWalletTypesToWalletInfo(
    state,
    getWalletInfo,
    listAvailableWalletTypes,
    chain
  );

  const sortedWallets = sortWalletsBasedOnConnectionState(wallets);
  const [error, setError] = useState('');

  const isExperimentalChainNotAdded = (walletType: string) =>
    !connectedWallets.find(
      (connectedWallet) =>
        connectedWallet.walletType === walletType &&
        connectedWallet.chain === chain
    );

  const handleClick = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (error) {
        setError('');
      }
      if (wallet.connected) {
        await disconnect(type);
      } else {
        const atLeastOneWalletIsConnected = !!wallets.find(
          (w) => w.state === WalletState.CONNECTED
        );
        if (!config?.multiWallets && atLeastOneWalletIsConnected) {
          return;
        }
        onBeforeConnect?.(type);
        await connect(type);
        onConnect?.(type);
      }
    } catch (e) {
      setError('Error: ' + (e as any)?.message);
    }
  };

  const disconnectConnectingWallets = useCallback(() => {
    const connectingWallets =
      wallets?.filter((wallet) => wallet.state === WalletState.CONNECTING) ||
      [];
    for (const wallet of connectingWallets) {
      void disconnect(wallet.type);
    }
  }, [hashWalletsState(wallets)]);

  useEffect(() => {
    return () => {
      disconnectConnectingWallets();
    };
  }, []);

  /*
   * Atm, we only support default injected wallet for the EVM
   * so we show default wallet when there is no other evm wallet installed
   * but we have ethereum injected
   */
  const shouldShowDefaultInjectedWallet = (wallets: WalletInfo[]) => {
    const isEvmWalletInstalledExceptDefault = wallets.filter(
      (wallet) =>
        wallet.state != WalletState.NOT_INSTALLED &&
        ![WalletTypes.DEFAULT, WalletTypes.WALLET_CONNECT_2].includes(
          wallet.type as WalletTypes
        ) &&
        getWalletInfo(wallet.type).supportedChains.filter(
          (blockchain) => blockchain.type == 'EVM'
        ).length > 0
    );
    return isEvmWalletInstalledExceptDefault.length == 0;
  };

  const shouldExcludeWallet = (
    walletType: string,
    chain: string,
    blockchains: BlockchainMeta[]
  ) => {
    return (
      (isExperimentalChain(blockchains, chain) &&
        isExperimentalChainNotAdded(walletType) &&
        !KEPLR_COMPATIBLE_WALLETS.includes(walletType)) ||
      (walletType == WalletTypes.DEFAULT &&
        !shouldShowDefaultInjectedWallet(wallets))
    );
  };

  return {
    list: sortedWallets.filter(
      (wallet) => !shouldExcludeWallet(wallet.type, chain ?? '', blockchains)
    ),
    error,
    handleClick,
    disconnectConnectingWallets,
  };
}
