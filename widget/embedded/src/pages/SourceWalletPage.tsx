import { styled, Typography } from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { WalletList } from '../components/ConfirmWalletsModal/WalletList';
import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';

export const Description = styled('div', {
  paddingBottom: '$15',
  textAlign: 'center',
});

const Container = styled('div', {
  padding: '$20',
});

export const ListContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  columnGap: '$5',
  rowGap: '$10',
  flexWrap: 'wrap',
  height: '100%',
});

export function SourceWalletPage() {
  const { t } = useTranslation();
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

  const isSelected = (walletType: string, blockchain: string) => {
    return (
      selectedWallets.source?.blockchain === blockchain &&
      selectedWallets.source?.type === walletType
    );
  };

  return (
    <Layout
      header={{
        title: t('Connect {{sourceBlockchain}} wallet', { sourceBlockchain }),
      }}>
      <Container>
        <Description>
          <Typography variant="body" size="small" color="neutral700">
            {t('You need to connect {{sourceBlockchain}} wallet.', {
              sourceBlockchain,
            })}
          </Typography>
        </Description>
        <ListContainer>
          <WalletList
            chain={sourceBlockchain}
            isSelected={isSelected}
            onShowMore={() => {
              //
            }}
            selectWallet={(wallet) => {
              setWalletsAsSelected({
                source: {
                  address: wallet.address,
                  blockchain: wallet.chain,
                  type: wallet.walletType,
                },
              });
            }}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
