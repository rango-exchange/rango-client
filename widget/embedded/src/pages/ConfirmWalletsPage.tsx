import React from 'react';
import { ConfirmWallets, SecondaryPage } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRoute } from '../hooks/useBestRoute';
import { useBestRouteStore } from '../store/bestRoute';
import { useWalletsStore } from '../store/wallets';
import { WalletType } from '@rangodev/wallets-shared';
import { useWallets } from '@rangodev/wallets-core';
import { BestRouteResponse } from 'rango-sdk';

export interface SelectableWallet {
  blockchain: string;
  walletType: WalletType;
  address: string;
  image: string;
}

export function ConfirmWalletsPage() {
  const navigate = useNavigate();

  const { bestRoute } = useBestRouteStore();
  const { accounts } = useWalletsStore();
  const { state, getWalletInfo } = useWallets();
  const requiredWallets = (route: BestRouteResponse | null) => {
    const wallets: string[] = [];
    route?.result?.swaps.forEach((swap) => {
      const currentStepBlockchain = swap.from.blockchain;
      const lastAddedWallet = wallets[wallets.length - 1];
      if (currentStepBlockchain != lastAddedWallet) wallets.push(currentStepBlockchain);
    });
    return wallets;
  };

  const connectedWallets: SelectableWallet[] = [];
  accounts.forEach((account) => {
    account.accounts.forEach((acc) => {
      connectedWallets.push({
        address: acc.address,
        walletType: acc.walletType as WalletType,
        blockchain: account.blockchain,
        image: getWalletInfo(acc.walletType as WalletType).img,
      });
    });
  });
  return (
    <ConfirmWallets
      requiredWallets={requiredWallets(bestRoute)}
      selectableWallets={connectedWallets.filter((wallet) =>
        requiredWallets(bestRoute).includes(wallet.blockchain),
      )}
      onBack={() => navigate(-1)}
      swap={bestRoute as any}
    />
  );
  return <div>hi</div>;
}
