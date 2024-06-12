import type { Namespaces } from '@rango-dev/wallets-core';
import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import {
  Divider,
  getCategoriesCount,
  SelectableCategoryList,
  styled,
  Typography,
  Wallet,
  WalletState,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { Layout, PageContainer } from '../components/Layout';
import { WalletModal } from '../components/WalletModal';
import { WalletNamespacesModal } from '../components/WalletNamespacesModal';
import { useWalletList } from '../hooks/useWalletList';
import { useAppStore } from '../store/AppStore';
import { useUiStore } from '../store/ui';
import { getContainer } from '../utils/common';
import {
  filterBlockchainsByWalletTypes,
  filterWalletsByCategory,
} from '../utils/wallets';

export interface NamespacesModalState {
  providerType: string;
  providerImage: string;
  availableNamespaces?: Namespaces[];
  singleNamespace?: boolean;
}

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

export function WalletsPage() {
  const { fetchStatus: fetchMetaStatus } = useAppStore();
  const [blockchainCategory, setBlockchainCategory] = useState<string>('ALL');
  const blockchains = useAppStore().blockchains();

  const [openModal, setOpenModal] = useState(false);
  const [namespacesModalState, setNamespacesModalState] =
    useState<NamespacesModalState | null>(null);
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType>('');
  let modalTimerId: ReturnType<typeof setTimeout> | null = null;
  const isActiveTab = useUiStore.use.isActiveTab();

  const { list, handleClick, error, disconnectConnectingWallets } =
    useWalletList({
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

  const filteredBlockchains = filterBlockchainsByWalletTypes(list, blockchains);
  const activeCategoriesCount = getCategoriesCount(filteredBlockchains);
  const showCategory = activeCategoriesCount !== 1;

  const filteredWallets = filterWalletsByCategory(list, blockchainCategory);

  return (
    <Layout
      header={{
        title: i18n.t('Connect Wallets'),
      }}>
      <Container>
        {showCategory && (
          <>
            <SelectableCategoryList
              setCategory={setBlockchainCategory}
              category={blockchainCategory}
              blockchains={filteredBlockchains}
              isLoading={fetchMetaStatus === 'loading'}
            />
            <Divider size={24} />
          </>
        )}
        <Typography variant="title" size="xmedium" align="center">
          {i18n.t('Choose a wallet to connect.')}
        </Typography>
        <ListContainer>
          {filteredWallets.map((wallet, index) => {
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

                  const legacyCondition =
                    !!wallet.namespaces &&
                    wallet.state === WalletState.DISCONNECTED;
                  const hubCondition =
                    detachedInstances && wallet.state !== 'connected';

                  if (legacyCondition || hubCondition) {
                    const isHub = !!wallet.properties;

                    const availableNamespaces = isHub
                      ? detachedInstances?.value
                      : wallet.namespaces;

                    setNamespacesModalState({
                      providerType: type,
                      providerImage: wallet.image,
                      availableNamespaces,
                      singleNamespace: wallet.singleNamespace,
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
          <WalletNamespacesModal
            open={!!namespacesModalState}
            onClose={() => setNamespacesModalState(null)}
            onConfirm={(namespaces) => {
              if (namespacesModalState) {
                void handleClick(
                  namespacesModalState?.providerType,
                  namespaces.map((ns) => ({
                    namespace: ns,
                    network: undefined,
                  }))
                );
                setNamespacesModalState(null);
              }
            }}
            image={namespacesModalState?.providerImage}
            namespaces={namespacesModalState?.availableNamespaces}
            singleNamespace={namespacesModalState?.singleNamespace}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
