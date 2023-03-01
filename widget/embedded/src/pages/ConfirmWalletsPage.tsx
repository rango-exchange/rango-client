import React, { useEffect } from 'react';
import { ConfirmWallets } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useWalletsStore } from '../store/wallets';
import { useWallets } from '@rango-dev/wallets-core';
import { navigationRoutes } from '../constants/navigationRoutes';
import { getRequiredChains, getSelectableWallets, SelectedWallet } from '../utils/wallets';
import { requiredWallets } from '../utils/swap';
import { useMetaStore } from '../store/meta';

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
        selectedWallets,
        getWalletInfo,
        getRequiredChains(bestRoute),
      )}
      onBack={() => navigate(-1)}
      swap={bestRoute!}
      onConfirm={() => navigate(navigationRoutes.confirmSwap)}
      onChange={(wallet) => setSelectedWallet(wallet)}
      confirmDisabled={confirmDisabled}
      blockchains={blockchains}
      connect={connect}
    />
  );
}