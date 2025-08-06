import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MoreWalletsToSelect } from '../components/MoreWalletsToSelect/MoreWalletsToSelect';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';

export function SourceWalletPage() {
  const { fromBlockchain } = useQuoteStore();
  const { selectedWallets, setWalletsAsSelected } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const sourceBlockchain = fromBlockchain?.name;

  useEffect(() => {
    if (!sourceBlockchain) {
      navigate(`../${navigationRoutes.wallets}${location.search}`, {
        replace: true,
      });
    }
  }, []);

  if (!sourceBlockchain) {
    return null;
  }

  const isSelected = (walletType: string) => {
    return (
      selectedWallets.source?.blockchain === sourceBlockchain &&
      selectedWallets.source?.type === walletType
    );
  };

  return (
    <MoreWalletsToSelect
      blockchain={sourceBlockchain}
      isSelected={isSelected}
      selectWallet={(wallet) =>
        setWalletsAsSelected({
          source: {
            address: wallet.address,
            blockchain: wallet.chain,
            type: wallet.walletType,
          },
        })
      }
    />
  );
}
