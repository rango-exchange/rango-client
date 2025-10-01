import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MoreWalletsToSelect } from '../components/MoreWalletsToSelect/MoreWalletsToSelect';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';

export function SourceWalletPage() {
  const { fromBlockchain } = useQuoteStore();
  const { setSelectedWallet } = useAppStore();
  const sourceWallet = useAppStore().selectedWallet('source');
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

  const isSelected = (walletType: string, blockchain: string) => {
    return (
      sourceWallet?.chain === blockchain &&
      sourceWallet?.walletType === walletType
    );
  };

  return (
    <MoreWalletsToSelect
      blockchain={sourceBlockchain}
      isSelected={isSelected}
      selectWallet={(wallet) => {
        setSelectedWallet({
          kind: 'source',
          wallet: {
            address: wallet.address,
            blockchain: wallet.chain,
            type: wallet.walletType,
          },
        });
      }}
    />
  );
}
