import React, { useEffect } from 'react';
import { ConfirmWallets } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useWalletsStore } from '../store/wallets';
import { useWallets } from '@rangodev/wallets-core';
import { navigationRoutes } from '../constants/navigationRoutes';
import { getRequiredChains, getSelectableWallets, SelectedWallet } from '../utils/wallets';
import { requiredWallets } from '../utils/swap';

export interface SelectableWallet extends SelectedWallet {
  image: string;
  selected: boolean;
}

export function ConfirmWalletsPage() {
  const navigate = useNavigate();

  const { bestRoute } = useBestRouteStore();
  const { accounts, selectedWallets, initSelectedWallets, setSelectedWallet } = useWalletsStore();
  const { getWalletInfo } = useWallets();
  const confirmDisabled = !requiredWallets(bestRoute).every((chain) =>
    selectedWallets.map((wallet) => wallet.chain).includes(chain),
  );

  useEffect(() => {
    initSelectedWallets();
  }, []);

  return (
    <ConfirmWallets
      requiredWallets={getRequiredChains(bestRoute)}
      selectableWallets={getSelectableWallets(
        accounts,
        getRequiredChains(bestRoute),
        selectedWallets,
        getWalletInfo,
      )}
      onBack={() => navigate(-1)}
      swap={bestRoute!}
      onConfirm={() => navigate(navigationRoutes.confirmSwap)}
      onChange={(wallet) => setSelectedWallet(wallet)}
      confirmDisabled={confirmDisabled}
    />
  );
}
