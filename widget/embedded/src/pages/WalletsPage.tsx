import type { WalletInfoWithExtra } from '../types';
import type { Namespace, WalletType } from '@rango-dev/wallets-shared';

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
import { WalletDerivationPathModal } from '../components/WalletDerivationPathModal';
import { WalletModal } from '../components/WalletModal';
import { WalletNamespacesModal } from '../components/WalletNamespacesModal';
import { useWalletList } from '../hooks/useWalletList';
import { useAppStore } from '../store/AppStore';
import { useUiStore } from '../store/ui';
import { getContainer, isSingleWalletActive } from '../utils/common';
import {
  filterBlockchainsByWalletTypes,
  filterWalletsByCategory,
} from '../utils/wallets';

interface NamespacesModalState {
  open: boolean;
  providerType: string;
  providerImage: string;
  availableNamespaces?: Namespace[];
  singleNamespace?: boolean;
}

interface DerivationPathModalState {
  open: boolean;
  providerType: string;
  providerImage: string;
  namespace: Namespace;
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
  const { config } = useAppStore();

  const [openModal, setOpenModal] = useState(false);
  const [namespacesModalState, setNamespacesModalState] =
    useState<NamespacesModalState | null>(null);
  const [derivationPathModalState, setDerivationPathModalState] =
    useState<DerivationPathModalState | null>(null);
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
      onConnect: (type) => {
        if (modalTimerId) {
          clearTimeout(modalTimerId);
        }
        setTimeout(() => {
          if (selectedWalletType === type) {
            setOpenModal(false);
          }
        }, TIME_TO_CLOSE_MODAL);
      },
    });

  const handleCloseWalletModal = () => {
    disconnectConnectingWallets();
    setOpenModal(false);
  };

  const handleCloseNamespaceModal = () => {
    if (namespacesModalState) {
      setNamespacesModalState({
        ...namespacesModalState,
        open: false,
      });
    }
  };

  const handleCloseDerivationPathModal = () => {
    if (derivationPathModalState) {
      setDerivationPathModalState({
        ...derivationPathModalState,
        open: false,
      });
    }
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

  const handleWalletItemClick = (wallet: WalletInfoWithExtra) => {
    if (isSingleWalletActive(list, config.multiWallets)) {
      return;
    }

    if (
      !!wallet.namespaces?.length &&
      wallet.state === WalletState.DISCONNECTED
    ) {
      if (wallet.namespaces.length > 1) {
        setNamespacesModalState({
          open: true,
          providerType: wallet.type,
          providerImage: wallet.image,
          availableNamespaces: wallet.namespaces,
          singleNamespace: wallet.singleNamespace,
        });
      } else if (wallet.needsDerivationPath) {
        setDerivationPathModalState({
          open: true,
          providerType: wallet.type,
          providerImage: wallet.image,
          namespace: wallet.namespaces[0],
        });
      } else {
        void handleClick(wallet.type);
      }
    } else {
      void handleClick(wallet.type);
    }
  };

  const handleConfirmNamespaces = (selectedNamespaces: Namespace[]) => {
    const wallet = filteredWallets.find(
      (wallet) => wallet.type === namespacesModalState?.providerType
    );
    if (
      wallet?.singleNamespace && // Currently we support derivation path only for single namespace wallets
      wallet?.needsDerivationPath &&
      selectedNamespaces[0]
    ) {
      setDerivationPathModalState({
        open: true,
        providerType: wallet.type,
        providerImage: wallet.image,
        namespace: selectedNamespaces[0],
      });
    } else {
      void handleClick(
        namespacesModalState?.providerType as string,
        selectedNamespaces.map((namespace) => ({
          namespace,
        }))
      );
    }
    handleCloseNamespaceModal();
  };

  const handleDerivationPathConfirm = (derivationPath: string) => {
    if (derivationPath && derivationPathModalState?.namespace) {
      void handleClick(derivationPathModalState.providerType, [
        { namespace: derivationPathModalState.namespace, derivationPath },
      ]);
    }

    handleCloseDerivationPathModal();
  };

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
                onClick={() => handleWalletItemClick(wallet)}
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
            open={!!namespacesModalState?.open}
            onClose={handleCloseNamespaceModal}
            onConfirm={handleConfirmNamespaces}
            image={namespacesModalState?.providerImage}
            availableNamespaces={namespacesModalState?.availableNamespaces}
            singleNamespace={namespacesModalState?.singleNamespace}
          />
          <WalletDerivationPathModal
            open={!!derivationPathModalState?.open}
            selectedNamespace={derivationPathModalState?.namespace}
            type={derivationPathModalState?.providerType}
            image={derivationPathModalState?.providerImage}
            onClose={handleCloseDerivationPathModal}
            onConfirm={handleDerivationPathConfirm}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
