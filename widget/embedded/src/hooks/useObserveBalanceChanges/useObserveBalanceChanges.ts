import type { WalletEventData } from '../../types';

import { useWallets } from '@rango-dev/wallets-react';
import { useEffect, useRef, useState } from 'react';

import { widgetEventEmitter } from '../../services/eventEmitter';
import { useWalletsStore } from '../../store/wallets';
import { WalletEventTypes, WidgetEvents } from '../../types';

// A hook to listen for and detect changes in balances on a specific blockchain.
export function useObserveBalanceChanges(selectedBlockchain?: string) {
  const { connectedWallets } = useWalletsStore();
  const { getWalletInfo } = useWallets();
  const prevFetchingBalanceWallets = useRef<string[]>([]);
  // The "balanceKey" will be updated and incremented after each change in the balance for a blockchain.
  const [balanceKey, setBalanceKey] = useState(0);

  useEffect(() => {
    const handleWalletEvent = (event: WalletEventData) => {
      if (event.type === WalletEventTypes.DISCONNECT) {
        const walletInfo = getWalletInfo(event.payload.walletType);
        const blockchainSupported = walletInfo.supportedChains.some(
          (chain) => chain.name === selectedBlockchain
        );

        if (blockchainSupported) {
          setBalanceKey((prev) => prev + 1);
        }
      }
    };

    widgetEventEmitter.on(WidgetEvents.WalletEvent, handleWalletEvent);

    if (!selectedBlockchain) {
      return setBalanceKey((prev) => prev + 1);
    }

    const supportedWallets = connectedWallets.filter(
      (wallet) => wallet.chain === selectedBlockchain
    );

    supportedWallets.forEach((wallet) => {
      const { walletType } = wallet;
      const walletIsAlreadyFetching =
        prevFetchingBalanceWallets.current.includes(walletType);

      /**
       * Watching for changes in "wallet.balances.length" is not accurate.
       * Additionally, checking the equality of previous and current balances for a specific blockchain is resource-intensive, so we avoid these methods.
       */
      if (wallet.loading && !walletIsAlreadyFetching) {
        prevFetchingBalanceWallets.current =
          prevFetchingBalanceWallets.current.concat(walletType);
      } else if (!wallet.loading && walletIsAlreadyFetching) {
        prevFetchingBalanceWallets.current =
          prevFetchingBalanceWallets.current.filter(
            (prevWallet) => prevWallet !== walletType
          );
        setBalanceKey((prev) => prev + 1);
      }
    });

    return () =>
      widgetEventEmitter.off(WidgetEvents.WalletEvent, handleWalletEvent);
  }, [connectedWallets, selectedBlockchain, getWalletInfo]);

  return { balanceKey };
}
