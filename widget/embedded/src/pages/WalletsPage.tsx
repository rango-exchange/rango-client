import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import { styled, Typography, Wallet, WalletState } from '@rango-dev/ui';
import React, { Fragment, useState } from 'react';

import { Layout } from '../components/Layout';
import { WalletModal } from '../components/WalletModal';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useWalletList } from '../hooks/useWalletList';
import { useAppStore } from '../store/AppStore';
import { getContainer } from '../utils/common';

const ListContainer = styled('div', {
  display: 'grid',
  gap: '$10',
  gridTemplateColumns: ' repeat(3, minmax(0, 1fr))',
  alignContent: 'baseline',
  paddingTop: '$15',
  height: '100%',
});

const Container = styled('div', {
  textAlign: 'center',
});

export const TIME_TO_CLOSE_MODAL = 3_000;
export const TIME_TO_IGNORE_MODAL = 300;

export function WalletsPage() {
  const { config, fetchStatus: fetchMetaStatus } = useAppStore()();
  const { navigateBackFrom } = useNavigateBack();
  const [openModal, setOpenModal] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType>('');
  let modalTimerId: ReturnType<typeof setTimeout> | null = null;

  const { list, handleClick, error } = useWalletList({
    config,
    onBeforeConnect: (type) => {
      modalTimerId = setTimeout(() => {
        setOpenModal(true);
        setSelectedWalletType(type);
      }, TIME_TO_IGNORE_MODAL);
    },
    onConnect: () => {
      if (modalTimerId) {
        clearTimeout(modalTimerId);
      }
      setTimeout(() => {
        setOpenModal(false);
      }, TIME_TO_CLOSE_MODAL);
    },
  });

  const selectedWallet = list.find(
    (wallet) => wallet.type === selectedWalletType
  );
  const selectedWalletImage = selectedWallet?.image || '';
  const selectedWalletState =
    selectedWallet?.state || WalletState.NOT_INSTALLED;

  return (
    <Layout
      header={{
        title: i18n.t('Connect Wallets'),
        onBack: () => navigateBackFrom(navigationRoutes.wallets),
      }}>
      <Container>
        <Typography variant="title" size="xmedium" align="center">
          {i18n.t('Choose a wallet to connect.')}
        </Typography>
        <ListContainer>
          {list.map((wallet, index) => {
            const key = `wallet-${index}-${wallet.type}`;
            return (
              <Fragment key={key}>
                <Wallet
                  {...wallet}
                  container={getContainer()}
                  onClick={(type) => {
                    void handleClick(type);
                  }}
                  isLoading={fetchMetaStatus === 'loading'}
                />
              </Fragment>
            );
          })}
          <WalletModal
            open={!!openModal}
            onClose={() => setOpenModal(false)}
            image={selectedWalletImage}
            state={selectedWalletState}
            error={error}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
