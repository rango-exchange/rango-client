import type { ExtendedModalWalletInfo } from '../utils/wallets';
import type { WalletInfo } from '@rango-dev/ui';

import { WalletTypes } from '@rango-dev/provider-all';
import { WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import { useCallback, useEffect } from 'react';

import { useAppStore } from '../store/AppStore';
import { detectMobileScreens } from '../utils/common';
import { emitWalletDetected } from '../utils/events';
import { configWalletsToWalletName } from '../utils/providers';
import {
  hashWalletsState,
  mapWalletTypesToWalletInfo,
  sortWalletsBasedOnConnectionState,
} from '../utils/wallets';

import { useStatefulConnect } from './useStatefulConnect/useStatefulConnect';

/**
 * Wallet types we've already reported as detected this session. Module-scoped so
 * the `walletDetected` event fires at most once per provider regardless of how
 * often the wallet list re-renders or remounts.
 */
const detectedWalletsReported = new Set<string>();

/**
 * Wallet types that aren't browser-injected extensions (hardware wallets,
 * WalletConnect, TON Connect). Their presence doesn't indicate an installed
 * wallet, so they're excluded from the `walletDetected` signal.
 */
const NON_INJECTED_WALLET_TYPES = new Set<string>([
  WalletTypes.LEDGER,
  WalletTypes.TREZOR,
  WalletTypes.WALLET_CONNECT_2,
  WalletTypes.TON_CONNECT,
  WalletTypes.DEFAULT,
]);

const DEFAULT_EVM_WALLETS = new Set<string>([
  WalletTypes.DEFAULT,
  WalletTypes.WALLET_CONNECT_2,
  WalletTypes.LEDGER,
]);

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
  const { getAvailableProviders } = useAppStore();
  const { state, getWalletInfo } = useWallets();
  const { handleDisconnect } = useStatefulConnect();

  /** It can be what has been set by widget config or as a fallback we use all the supported wallets by our library */
  const listAvailableWalletTypes = configWalletsToWalletName(
    getAvailableProviders()
  );

  let wallets = mapWalletTypesToWalletInfo(
    state,
    getWalletInfo,
    listAvailableWalletTypes,
    chain
  );

  wallets = detectMobileScreens()
    ? wallets.filter(
        (wallet) =>
          wallet.showOnMobile !== false && state(wallet.type).installed
      )
    : wallets;

  const sortedWallets = sortWalletsBasedOnConnectionState(wallets);

  useEffect(() => {
    wallets.forEach((wallet) => {
      if (NON_INJECTED_WALLET_TYPES.has(wallet.type)) {
        return;
      }
      const isDetected = wallet.state !== WalletState.NOT_INSTALLED;
      if (isDetected && !detectedWalletsReported.has(wallet.type)) {
        detectedWalletsReported.add(wallet.type);
        emitWalletDetected({
          walletName: wallet.type,
        });
      }
    });
  }, [hashWalletsState(wallets)]);

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
        !DEFAULT_EVM_WALLETS.has(wallet.type) &&
        getWalletInfo(wallet.type).supportedChains.filter(
          (blockchain) => blockchain.type == 'EVM'
        ).length > 0
    );
    return isEvmWalletInstalledExceptDefault.length == 0;
  };

  const shouldExcludeWallet = (walletType: string) => {
    return (
      walletType == WalletTypes.DEFAULT &&
      !shouldShowDefaultInjectedWallet(wallets)
    );
  };

  return {
    list: sortedWallets.filter((wallet) => !shouldExcludeWallet(wallet.type)),
    terminateConnectingWallets,
  };
}
