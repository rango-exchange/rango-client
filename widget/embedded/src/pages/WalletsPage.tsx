import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import { styled, Typography, Wallet, WalletState } from '@rango-dev/ui';
import { TransactionType } from 'rango-sdk';
import React, { useState } from 'react';

import { Layout, PageContainer } from '../components/Layout';
import { WalletModal } from '../components/WalletModal';
import { WalletTransactionTypesModal } from '../components/WalletTransactionTypesModal';
import { useWalletList } from '../hooks/useWalletList';
import { useAppStore } from '../store/AppStore';
import { useUiStore } from '../store/ui';
import { getContainer } from '../utils/common';

const ListContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$10',
  flexWrap: 'wrap',
  paddingTop: '$5',
});

const Container = styled(PageContainer, {
  textAlign: 'center',
});

export const TIME_TO_CLOSE_MODAL = 3_000;
export const TIME_TO_IGNORE_MODAL = 300;

interface TransactionTypesModalConfig {
  providerType: string;
  availableTransactionTypes: TransactionType[];
}

export function WalletsPage() {
  const { config, fetchStatus: fetchMetaStatus } = useAppStore();
  const [openModal, setOpenModal] = useState(false);
  const [transactionTypesModalConfig, setTransactionTypesModalConfig] =
    useState<TransactionTypesModalConfig | null>(null);
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
                  if (
                    wallet.type === 'phantom' &&
                    wallet.state === WalletState.DISCONNECTED
                  ) {
                    setTransactionTypesModalConfig({
                      providerType: type,
                      availableTransactionTypes: [
                        TransactionType.SOLANA,
                        TransactionType.TRANSFER,
                      ],
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
          <WalletTransactionTypesModal
            open={!!transactionTypesModalConfig}
            onClose={() => setTransactionTypesModalConfig(null)}
            onConfirm={(transactionTypes) => {
              void handleClick(
                transactionTypesModalConfig?.providerType as string,
                transactionTypes
              );
              setTransactionTypesModalConfig(null);
            }}
            transactionTypes={
              transactionTypesModalConfig?.availableTransactionTypes
            }
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
