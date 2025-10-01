import type { SupportedWalletsPropTypes } from './RouteWalletsPage.types';
import type { Wallet } from '../../types';

import { i18n } from '@lingui/core';
import { Alert, Button, Divider, Typography } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WalletList } from '../../components/ConfirmWalletsModal/WalletList';
import { Layout } from '../../components/Layout';
import { MoreWalletsToSelect } from '../../components/MoreWalletsToSelect/MoreWalletsToSelect';
import { ListContainer } from '../../components/MoreWalletsToSelect/MoreWalletsToSelect.styles';
import { navigationRoutes } from '../../constants/navigationRoutes';
import { useWalletList } from '../../hooks/useWalletList';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { getQuoteChains } from '../../utils/wallets';

import { Container, Title } from './RouteWalletsPage.styles';

const NUMBER_OF_WALLETS_TO_DISPLAY = 2;

export function SupportedWallets(props: SupportedWalletsPropTypes) {
  const { blockchain, isSelected, selectWallet, onShowMore } = props;
  const { list } = useWalletList({ chain: blockchain });

  if (!list.length) {
    return (
      <Alert
        type="error"
        variant="alarm"
        title={i18n.t(
          'There’s no supported wallet available for this chain. Please Change the route and try again.'
        )}
      />
    );
  }

  return (
    <>
      <Title variant="title" size="xmedium">
        {i18n.t('Your {blockchain} wallets', { blockchain })}
      </Title>
      <ListContainer key={blockchain}>
        <WalletList
          chain={blockchain}
          isSelected={isSelected}
          selectWallet={selectWallet}
          limit={NUMBER_OF_WALLETS_TO_DISPLAY}
          onShowMore={onShowMore}
        />
      </ListContainer>
    </>
  );
}

export function RouteWalletsPage() {
  const { selectedQuote } = useQuoteStore();
  const routeWallets = useAppStore().selectedWallet('route');
  console.log({ routeWallets });
  const { connectedWallets, setSelectedWallet, suggestRouteWallets } =
    useAppStore();
  const navigate = useNavigate();
  const [showRouteWalletsError, setShowRouteWalletsError] = useState(false);
  const [showMoreWalletsFor, setShowMoreWalletsFor] = useState<string | null>(
    null
  );

  useEffect(() => {
    suggestRouteWallets();
  }, []);

  useEffect(() => {
    if (!selectedQuote) {
      navigate('../');
    }
  }, []);

  if (!selectedQuote) {
    return null;
  }

  const requiredBlockchains = getQuoteChains({
    quote: selectedQuote,
    filter: 'required',
  });

  const isSelected = (walletType: string, blockchain: string) => {
    const wallet = routeWallets?.[blockchain];
    return !!wallet && wallet.walletType === walletType;
  };

  const resetState = () => {
    setShowRouteWalletsError(false);
  };

  const selectWallet = (wallet: Wallet) => {
    resetState();
    setShowMoreWalletsFor(null);
    const matchedWallet = connectedWallets.find(
      (connectedWallet) =>
        connectedWallet.chain === wallet.chain &&
        connectedWallet.walletType === wallet.walletType &&
        connectedWallet.address === wallet.address
    );
    if (matchedWallet) {
      setSelectedWallet({ kind: 'route', wallets: [matchedWallet] });
    }
  };

  const handleConfirmWallets = () => {
    const everyRequiredWalletsSelected = !requiredBlockchains.some(
      (blockchain) => !routeWallets?.[blockchain]
    );

    if (!everyRequiredWalletsSelected) {
      setShowRouteWalletsError(true);
      return;
    }
    navigate('../' + navigationRoutes.confirmSwap);
  };

  return (
    <>
      {showMoreWalletsFor && (
        <MoreWalletsToSelect
          blockchain={showMoreWalletsFor}
          selectWallet={selectWallet}
          isSelected={isSelected}
          onClickBack={() => setShowMoreWalletsFor(null)}
        />
      )}
      {!showMoreWalletsFor && (
        <Layout
          header={{ title: i18n.t('Route Wallet') }}
          footer={
            <Button
              id="widget-route-wallets-page-confirm-btn"
              onClick={handleConfirmWallets}
              variant="contained"
              type="primary"
              fullWidth
              size="large">
              {i18n.t('Confirm')}
            </Button>
          }>
          <Container>
            {showRouteWalletsError && (
              <>
                <Alert
                  type="error"
                  variant="alarm"
                  title={i18n.t(
                    'You need to connect wallets for all chains in your route to proceed.'
                  )}
                />
                <Divider size={8} />
              </>
            )}
            <div>
              <Typography variant="body" size="medium" color="neutral700">
                {i18n.t(
                  'Please connect the route wallet for your route to ensure a refund if an error occurs.'
                )}
              </Typography>
              <Divider size={8} />

              {requiredBlockchains.map((blockchain) => (
                <SupportedWallets
                  key={blockchain}
                  blockchain={blockchain}
                  isSelected={isSelected}
                  selectWallet={selectWallet}
                  onShowMore={() => setShowMoreWalletsFor(blockchain)}
                />
              ))}
            </div>
          </Container>
        </Layout>
      )}
    </>
  );
}
