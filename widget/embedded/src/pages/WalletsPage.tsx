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
import { WalletModal } from '../components/WalletModal';
import {
  WalletDerivationPathModal,
  WalletNamespacesModal,
} from '../components/WalletStatefulConnect';
import { useStatefulConnect } from '../components/WalletStatefulConnect/useStatefulConnect';
import { useWalletList } from '../hooks/useWalletList';
import { useAppStore } from '../store/AppStore';
import { useUiStore } from '../store/ui';
import { getContainer, isSingleWalletActive } from '../utils/common';
import {
  filterBlockchainsByWalletTypes,
  filterWalletsByCategory,
} from '../utils/wallets';

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
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType>('');
  let modalTimerId: ReturnType<typeof setTimeout> | null = null;
  const isActiveTab = useUiStore.use.isActiveTab();

  const {
    handleConnect,
    handleDerivationPath,
    handleNamespace,
    getState,
    resetState,
  } = useStatefulConnect();

  const handleConnectParams = {
    onBeforeConnect: (type: WalletType) => {
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
  };

  const [error, setError] = useState<string>();
  const catchErrorOnHandle = (error: any) => setError(error.message);
  const { list, terminateConnectingWallets } = useWalletList();

  const handleCloseWalletModal = () => {
    terminateConnectingWallets();
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

  const handleWalletItemClick = (wallet: WalletInfoWithExtra) => {
    if (isSingleWalletActive(list, config.multiWallets)) {
      return;
    }

    handleConnect(wallet, handleConnectParams).catch(catchErrorOnHandle);
  };

  const handleConfirmNamespaces = (selectedNamespaces: Namespace[]) => {
    const wallet = filteredWallets.find(
      (wallet) => wallet.type === getState().namespace?.providerType
    );

    handleNamespace(wallet!, selectedNamespaces).catch(catchErrorOnHandle);
  };

  const handleDerivationPathConfirm = (derivationPath: string) => {
    if (!derivationPath) {
      throw new Error(
        "Derivation path is empty. Please make sure you've filled the field correctly."
      );
    }

    handleDerivationPath(derivationPath).catch(catchErrorOnHandle);
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
            open={getState().status === 'namespace'}
            onClose={() => {
              resetState();
            }}
            onConfirm={handleConfirmNamespaces}
            image={getState().namespace?.providerImage}
            availableNamespaces={getState().namespace?.availableNamespaces}
            singleNamespace={getState().namespace?.singleNamespace}
          />
          <WalletDerivationPathModal
            open={getState().status === 'derivationPath'}
            onClose={() => {
              resetState('derivation');
            }}
            onConfirm={handleDerivationPathConfirm}
            selectedNamespace={getState().derivationPath?.namespace}
            type={getState().derivationPath?.providerType}
            image={getState().derivationPath?.providerImage}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
