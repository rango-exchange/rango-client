import {
  Button,
  AddWalletIcon,
  Typography,
  styled,
  Spinner,
} from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallets } from '@rango-dev/wallets-core';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useUiStore } from '../store/ui';
import { AppRoutes } from './AppRoutes';
import { fetchingBalanceSelector, useWalletsStore } from '../store/wallets';
import {
  calculateWalletUsdValue,
  getSelectableWallets,
  tokensAreEqual,
} from '../utils/wallets';
import { removeDuplicateFrom } from '../utils/common';
import { WidgetConfig } from '../types';
import { useTranslation } from 'react-i18next';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';

const Header = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'end',
  '.balance': {
    display: 'flex',
  },
});

const WalletImage = styled('img', {
  width: '$24',
  height: '$24',
  marginLeft: -15,
  marginRight: '$6',
  borderRadius: '99999px',
});

export type LayoutProps = {
  config?: WidgetConfig;
};

export function Layout({ config }: LayoutProps) {
  const navigate = useNavigate();
  const { balances, accounts, selectedWallets } = useWalletsStore();
  const { getWalletInfo } = useWallets();
  const connectedWalletsImages = removeDuplicateFrom(
    getSelectableWallets(accounts, selectedWallets, getWalletInfo).map(
      (w) => w.image
    )
  );
  const { blockchains, tokens } = useMetaStore.use.meta();
  const setFromChain = useBestRouteStore.use.setFromChain();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToChain = useBestRouteStore.use.setToChain();
  const setToToken = useBestRouteStore.use.setToToken();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const setAffiliateRef = useSettingsStore.use.setAffiliateRef();

  const totalBalance = calculateWalletUsdValue(balances);
  const connectWalletsButtonDisabled =
    useUiStore.use.connectWalletsButtonDisabled();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const fetchingBalance = useWalletsStore(fetchingBalanceSelector);

  const { t } = useTranslation();
  useEffect(() => {
    const chain = blockchains.find(
      (chain) => chain.name === config?.to?.blockchain
    );
    const token = tokens.find((t) =>
      tokensAreEqual(t, config?.to?.token || null)
    );
    setToChain(chain || null);
    setToToken(token || null);
  }, [config?.to?.token, config?.to?.blockchain]);

  useEffect(() => {
    setInputAmount(config?.amount?.toString() || '');
  }, [config?.amount]);

  useEffect(() => {
    const chain = blockchains.find(
      (chain) => chain.name === config?.from?.blockchain
    );
    const token = tokens.find((t) =>
      tokensAreEqual(t, config?.from?.token || null)
    );

    setFromChain(chain || null);
    setFromToken(token || null);
  }, [config?.from?.token, config?.from?.blockchain]);

  useEffect(() => {
    setAffiliateRef(config?.affiliateRef || null);
  }, [config?.affiliateRef]);
  return (
    <>
      <Header>
        <Button
          size="small"
          suffix={<AddWalletIcon size={20} />}
          variant="ghost"
          flexContent
          loading={loadingMetaStatus === 'loading'}
          disabled={loadingMetaStatus === 'failed'}
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
          <div className="balance">
            <Typography variant="body2">
              {!accounts?.length
                ? t('Connect Wallet')
                : `$${totalBalance || 0}`}
            </Typography>
            {fetchingBalance && <Spinner />}
          </div>
        </Button>
      </Header>
      <AppRoutes config={config} />
    </>
  );
}
