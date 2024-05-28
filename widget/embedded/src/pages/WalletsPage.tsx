import type { NamespaceValue } from '../components/SwapDetailsModal';
import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import { styled, Typography, Wallet, WalletState } from '@rango-dev/ui';
import React, { useState } from 'react';

import { Layout, PageContainer } from '../components/Layout';
import {
  WalletModal,
  WalletNamespacesListModal,
} from '../components/WalletModal';
import { useWalletList } from '../hooks/useWalletList';
import { useAppStore } from '../store/AppStore';
import { useUiStore } from '../store/ui';
import { getContainer } from '../utils/common';

const ListContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  gap: '$10',
  flexWrap: 'wrap',
  paddingTop: '$5',
  height: '100%',
});

const Container = styled(PageContainer, {
  textAlign: 'center',
});

export const TIME_TO_CLOSE_MODAL = 3_000;
export const TIME_TO_IGNORE_MODAL = 300;

export function WalletsPage() {
  const { config, fetchStatus: fetchMetaStatus } = useAppStore();
  const [openModal, setOpenModal] = useState(false);
  const [openNamespacesModal, setOpenNamespacesModal] = useState<
    NamespaceValue | undefined
  >(undefined);
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType>('');
  let modalTimerId: ReturnType<typeof setTimeout> | null = null;
  const isActiveTab = useUiStore.use.isActiveTab();

  const { list, handleClick, error, disconnectConnectingWallets } =
    useWalletList({
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

  const handleCloseWalletModal = () => {
    disconnectConnectingWallets();
    setOpenModal(false);
  };

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
      }}>
      <Container>
        <Typography variant="title" size="xmedium" align="center">
          {i18n.t('Choose a wallet to connect.')}
        </Typography>
        <ListContainer>
          {list.map((wallet, index) => {
            const key = `wallet-${index}-${wallet.type}`;

            return (
              <Wallet
                key={key}
                {...wallet}
                container={getContainer()}
                onClick={(type) => {
                  const detachedInstances = wallet.properties?.find(
                    (item) => item.name === 'detached'
                  );
                  if (detachedInstances && wallet.state !== 'connected') {
                    setOpenNamespacesModal({
                      providerId: type,
                      /*
                       * TODO: What i'm trying to here is connecting a namespace with no force to connect to a specific network.
                       * Code here works but it has implicit intentions.
                       */
                      namespaces: detachedInstances.value.map((namespace) => ({
                        namespace,
                        network: undefined,
                      })),
                    });
                  } else {
                    void handleClick(type);
                  }
                }}
                isLoading={fetchMetaStatus === 'loading'}
                disabled={!isActiveTab}
              />
            );
          })}
          <WalletModal
            open={!!openModal}
            onClose={handleCloseWalletModal}
            image={selectedWalletImage}
            state={selectedWalletState}
            error={error}
          />
          <WalletNamespacesListModal
            open={!!openNamespacesModal}
            onClose={() => setOpenNamespacesModal(undefined)}
            onConfirm={(namespaces) => {
              console.log('user selected these:', { namespaces });
              if (openNamespacesModal) {
                void handleClick(openNamespacesModal.providerId, namespaces);
              }
              setOpenNamespacesModal(undefined);
            }}
            namespaces={openNamespacesModal?.namespaces || []}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
