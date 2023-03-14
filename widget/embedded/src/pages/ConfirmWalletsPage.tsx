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
} from '../utils/wallets';
import { requiredWallets } from '../utils/swap';
import { decimalNumber } from '../utils/numbers';
import { useMetaStore } from '../store/meta';
import { Network, WalletType } from '@rango-dev/wallets-shared';
import { useNavigateBack } from '../hooks/useNavigateBack';

export function ConfirmWalletsPage() {
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
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
    getWalletInfo
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
      onBack={navigateBackFrom.bind(null, navigationRoutes.confirmWallets)}
      swap={bestRoute!}
      fromAmount={fromAmount}
      toAmount={toAmount}
      onConfirm={navigate.bind(null, navigationRoutes.confirmSwap)}
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
