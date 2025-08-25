import type { ExtendedModalWalletInfo } from '../utils/wallets';
import type { WalletInfo } from '@rango-dev/ui';
import type { BlockchainMeta } from 'rango-sdk';

import { WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import {
  detectMobileScreens,
  KEPLR_COMPATIBLE_WALLETS,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { useCallback, useEffect } from 'react';

import { useAppStore } from '../store/AppStore';
import { configWalletsToWalletName } from '../utils/providers';
import {
  hashWalletsState,
  isExperimentalChain,
  mapWalletTypesToWalletInfo,
  sortWalletsBasedOnConnectionState,
} from '../utils/wallets';

import { useStatefulConnect } from './useStatefulConnect/useStatefulConnect';

interface Params {
  chain?: string;
}

interface API {
  list: ExtendedModalWalletInfo[];
  terminateConnectingWallets: () => void;
}

/**
 *
 * Returning list of wallets which has a applied sorting and filtering (some of wallet can be excluded).
 * It can have some functionality on list itself,
 * now it only has a method to disconnect the wallets that has `connecting` status. This is useful for exiting page and terminating wallet connection.
 *
 */
export function useWalletList(params?: Params): API {
  const { chain } = params || {};
  const { connectedWallets, getAvailableProviders } = useAppStore();
  const { state, getWalletInfo, generateDeepLink } = useWallets();
  const blockchains = useAppStore().blockchains();
  const { handleDisconnect } = useStatefulConnect();

  /** It can be what has been set by widget config or as a fallback we use all the supported wallets by our library */
  const listAvailableWalletTypes = configWalletsToWalletName(
    getAvailableProviders()
  );

  let wallets = mapWalletTypesToWalletInfo(
    state,
    getWalletInfo,
    generateDeepLink,
    listAvailableWalletTypes,
    chain
  );

  wallets = detectMobileScreens()
    ? wallets.filter(
        (wallet) =>
          wallet.showOnMobile !== false &&
          (state(wallet.type).installed || !!wallet.generateDeepLink)
      )
    : wallets;

  const sortedWallets = sortWalletsBasedOnConnectionState(wallets, state);

  const isExperimentalChainNotAdded = (walletType: string) =>
    !connectedWallets.find(
      (connectedWallet) =>
        connectedWallet.walletType === walletType &&
        connectedWallet.chain === chain
    );

  const terminateConnectingWallets = useCallback(() => {
    const connectingWallets =
      wallets?.filter((wallet) => wallet.state === WalletState.CONNECTING) ||
      [];
    for (const wallet of connectingWallets) {
      void handleDisconnect(wallet);
    }
  }, [hashWalletsState(wallets)]);

  useEffect(() => {
    return () => {
      terminateConnectingWallets();
    };
  }, []);

  /*
   * Atm, we only support default injected wallet for the EVM
   * so we show default wallet when there is no other evm wallet installed
   * but we have ethereum injected
   */
  const shouldShowDefaultInjectedWallet = (wallets: WalletInfo[]) => {
    // don't show default injected wallet when it's not installed
    const defaultWallet = wallets.find(
      (wallet) => wallet.type === WalletTypes.DEFAULT
    );
    if (!defaultWallet || defaultWallet.state === WalletState.NOT_INSTALLED) {
      return false;
    }

    /*
     * if we have another evm wallet installed (except wallet connect),
     * there is no need to show default injected wallet anymore
     */
    const isEvmWalletInstalledExceptDefault = wallets.filter(
      (wallet) =>
        wallet.state != WalletState.NOT_INSTALLED &&
        ![
          WalletTypes.DEFAULT,
          WalletTypes.WALLET_CONNECT_2,
          WalletTypes.LEDGER,
        ].includes(wallet.type as WalletTypes) &&
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
    terminateConnectingWallets,
  };
}
