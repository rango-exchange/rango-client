import { i18n } from '@lingui/core';
import { styled, Typography } from '@rango-dev/ui';
import React, { useEffect } from 'react';
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
    <Layout
      header={{
        title: i18n.t('Connect {{sourceBlockchain}} wallet', {
          sourceBlockchain,
        }),
      }}>
      <Container>
        <Description>
          <Typography variant="body" size="small" color="neutral700">
            {i18n.t('You need to connect {{sourceBlockchain}} wallet.', {
              sourceBlockchain,
            })}
          </Typography>
        </Description>
        <ListContainer>
          <WalletList
            chain={sourceBlockchain}
            isSelected={isSelected}
            selectWallet={(wallet) => {
              setSelectedWallet('source', {
                address: wallet.address,
                blockchain: wallet.chain,
                type: wallet.walletType,
              });
            }}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
