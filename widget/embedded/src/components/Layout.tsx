import { Button, AddWalletIcon, Typography, styled } from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallets } from '@rango-dev/wallets-core';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useUiStore } from '../store/ui';
import { AppRoutes } from './AppRoutes';
import { useWalletsStore } from '../store/wallets';
import {
  calculateWalletUsdValue,
  getSelectableWallets,
} from '../utils/wallets';
import { removeDuplicateFrom } from '../utils/common';
import { Configs } from '../types';
import { useTranslation } from 'react-i18next';
import { useBestRouteStore } from '../store/bestRoute';

const Header = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'end',
});

const WalletImage = styled('img', {
  width: '$24',
  height: '$24',
  marginLeft: -15,
  marginRight: '$6',
  borderRadius: '99999px',
});

export type LayoutProps = {
  configs: Configs;
};

export function Layout({ configs }: LayoutProps) {
  const navigate = useNavigate();
  const { balances, accounts, selectedWallets } = useWalletsStore();
  const { getWalletInfo } = useWallets();
  const connectedWalletsImages = removeDuplicateFrom(
    getSelectableWallets(accounts, selectedWallets, getWalletInfo).map(
      (w) => w.image
    )
  );

  const setFromChain = useBestRouteStore.use.setFromChain();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToChain = useBestRouteStore.use.setToChain();
  const setToToken = useBestRouteStore.use.setToToken();
  const setInputAmount = useBestRouteStore.use.setInputAmount();

  const totalBalance = calculateWalletUsdValue(balances);
  const connectWalletsButtonDisabled =
    useUiStore.use.connectWalletsButtonDisabled();
  const { t } = useTranslation();
  useEffect(() => {
    setToChain(configs?.toChain || null);
    setToToken(configs?.toToken || null);
  }, [configs?.toChain, configs?.toToken]);
  useEffect(() => {
    setInputAmount(configs?.fromAmount.toString() || null);
  }, [configs?.fromAmount]);

  useEffect(() => {
    setFromToken(configs?.fromToken || null);
    setFromChain(configs?.fromChain || null);
  }, [configs?.fromToken, configs?.fromChain]);
  return (
    <>
      <Header>
        <Button
          size="small"
          suffix={<AddWalletIcon size={20} />}
          variant="ghost"
          flexContent
          onClick={() => {
            if (!connectWalletsButtonDisabled)
              navigate(navigationRoutes.wallets);
          }}
        >
          {connectedWalletsImages?.length ? (
            connectedWalletsImages.map((walletImage, index) => (
              <WalletImage key={index} src={walletImage} />
            ))
          ) : (
            <></>
          )}
          <Typography variant="body2">
            {!accounts?.length ? t('Connect Wallet') : `$${totalBalance || 0}`}
          </Typography>
        </Button>
      </Header>
      <AppRoutes {...configs} />
    </>
  );
}
