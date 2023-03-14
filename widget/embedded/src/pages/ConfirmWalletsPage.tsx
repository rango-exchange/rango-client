import React, { useEffect } from 'react';
import { ConfirmWallets } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useWalletsStore } from '../store/wallets';
import { useWallets } from '@rango-dev/wallets-core';
import { navigationRoutes } from '../constants/navigationRoutes';
import {
  getKeplrCompatibleConnectedWallets,
  getRequiredChains,
  getSelectableWallets,
  isExperimentalChain,
  SelectedWallet,
} from '../utils/wallets';
import { requiredWallets } from '../utils/swap';
import { decimalNumber } from '../utils/numbers';
import { useMetaStore } from '../store/meta';
import { Network, WalletType } from '@rango-dev/wallets-shared';

export interface SelectableWallet extends SelectedWallet {
  image: string;
  selected: boolean;
}

export function ConfirmWalletsPage() {
  const navigate = useNavigate();
  const bestRoute = useBestRouteStore.use.bestRoute();

  const { blockchains } = useMetaStore.use.meta();
  const accounts = useWalletsStore.use.accounts();
  const selectedWallets = useWalletsStore.use.selectedWallets();
  const initSelectedWallets = useWalletsStore.use.initSelectedWallets();
  const setSelectedWallet = useWalletsStore.use.setSelectedWallet();

  const { getWalletInfo, connect } = useWallets();
  const confirmDisabled = !requiredWallets(bestRoute).every((chain) =>
    selectedWallets.map((wallet) => wallet.chain).includes(chain)
  );

  const firstStep = bestRoute?.result?.swaps[0];
  const lastStep =
    bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1];

  const fromAmount = decimalNumber(firstStep?.fromAmount, 3);
  const toAmount = decimalNumber(lastStep?.toAmount, 3);
  useEffect(() => {
    initSelectedWallets();
  }, []);

  const selectableWallets = getSelectableWallets(
    accounts,
    selectedWallets,
    getWalletInfo,
    getRequiredChains(bestRoute)
  );

  const handleConnectChain = (wallet: string) => {
    const network = wallet as Network;
    getKeplrCompatibleConnectedWallets(selectableWallets).forEach(
      (compatibleWallet: WalletType) => connect?.(compatibleWallet, network)
    );
  };

  return (
    <ConfirmWallets
      requiredWallets={getRequiredChains(bestRoute)}
      selectableWallets={selectableWallets}
      onBack={() => navigate(-1)}
      swap={bestRoute!}
      fromAmount={fromAmount}
      toAmount={toAmount}
      onConfirm={() => navigate(navigationRoutes.confirmSwap)}
      onChange={(wallet) => setSelectedWallet(wallet)}
      confirmDisabled={confirmDisabled}
      handleConnectChain={(wallet) => handleConnectChain(wallet)}
      isExperimentalChain={(wallet) =>
        getKeplrCompatibleConnectedWallets(selectableWallets).length > 0
          ? isExperimentalChain(blockchains, wallet)
          : false
      }
    />
  );
}
