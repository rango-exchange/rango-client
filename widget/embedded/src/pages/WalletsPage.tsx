import type { WidgetConfig } from '../types';
import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import {
  LoadingFailedAlert,
  Spinner,
  styled,
  Typography,
  Wallet,
} from '@rango-dev/ui';
import React, { Fragment, useState } from 'react';

import { Layout } from '../components/Layout';
import { WalletModal } from '../components/WalletModal';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useWalletList } from '../hooks/useWalletList';
import { useMetaStore } from '../store/meta';

interface PropTypes {
  supportedWallets: WidgetConfig['wallets'];
  multiWallets: boolean;
  config?: WidgetConfig;
}

const ListContainer = styled('div', {
  display: 'grid',
  gap: '$10',
  gridTemplateColumns: ' repeat(3, minmax(0, 1fr))',
  alignContent: 'baseline',
  padding: '$15 $8 $20 0',
  overflowY: 'auto',
  height: 490,
});

const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  position: 'absolute',
  top: '50%',
});

const Container = styled('div', {
  textAlign: 'center',
});

export const TIME_TO_CLOSE_MODAL = 3_000;
export const TIME_TO_IGNORE_MODAL = 300;

export function WalletsPage({
  supportedWallets,
  multiWallets,
  config,
}: PropTypes) {
  const { navigateBackFrom } = useNavigateBack();
  const [openModal, setOpenModal] = useState<WalletType>('');
  let modalTimerId: ReturnType<typeof setTimeout> | null = null;

  const { list, handleClick, error } = useWalletList({
    supportedWallets,
    multiWallets,
    config,
    onBeforeConnect: (type) => {
      modalTimerId = setTimeout(() => {
        setOpenModal(type);
      }, TIME_TO_IGNORE_MODAL);
    },
    onConnect: () => {
      if (modalTimerId) {
        clearTimeout(modalTimerId);
      }
      setTimeout(() => {
        setOpenModal('');
      }, TIME_TO_CLOSE_MODAL);
    },
  });

  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  return (
    <Layout
      header={{
        title: i18n.t('Connect Wallets'),
        onBack: navigateBackFrom.bind(null, navigationRoutes.wallets),
      }}>
      <Container>
        {loadingMetaStatus === 'loading' && (
          <LoaderContainer className="loader">
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingMetaStatus === 'failed' && <LoadingFailedAlert />}
        <Typography variant="title" size="xmedium" align="center">
          {i18n.t('Choose a wallet to connect.')}
        </Typography>
        <ListContainer>
          {loadingMetaStatus === 'success' &&
            list.map((wallet, index) => {
              const key = `wallet-${index}-${wallet.type}`;
              return (
                <Fragment key={key}>
                  <Wallet
                    {...wallet}
                    onClick={(type) => {
                      void handleClick(type);
                    }}
                  />
                  {openModal === wallet.type && (
                    <WalletModal
                      open={openModal === wallet.type}
                      onClose={() => setOpenModal('')}
                      image={wallet.image}
                      state={wallet.state}
                      error={!!error}
                    />
                  )}
                </Fragment>
              );
            })}
        </ListContainer>
      </Container>
    </Layout>
  );
}
