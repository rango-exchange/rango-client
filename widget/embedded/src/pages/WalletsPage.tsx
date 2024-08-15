import type { WalletInfoWithExtra } from '../types';

import { i18n } from '@lingui/core';
import {
  Divider,
  getCategoriesCount,
  SelectableCategoryList,
  styled,
  Typography,
  Wallet,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { Layout, PageContainer } from '../components/Layout';
import { StatefulConnectModal } from '../components/StatefulConnectModal';
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

export function WalletsPage() {
  const { fetchStatus: fetchMetaStatus } = useAppStore();
  const [blockchainCategory, setBlockchainCategory] = useState<string>('ALL');
  const blockchains = useAppStore().blockchains();
  const { config } = useAppStore();

  const [selectedWalletToConnect, setSelectedWalletToConnect] =
    useState<WalletInfoWithExtra>();
  const isActiveTab = useUiStore.use.isActiveTab();

  const { list } = useWalletList();

  const filteredBlockchains = filterBlockchainsByWalletTypes(list, blockchains);
  const activeCategoriesCount = getCategoriesCount(filteredBlockchains);
  const showCategory = activeCategoriesCount !== 1;

  const filteredWallets = filterWalletsByCategory(list, blockchainCategory);

  const handleWalletItemClick = (wallet: WalletInfoWithExtra) => {
    if (isSingleWalletActive(list, config.multiWallets)) {
      return;
    }

    setSelectedWalletToConnect(wallet);
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
          <StatefulConnectModal
            wallet={selectedWalletToConnect}
            onClose={() => {
              setSelectedWalletToConnect(undefined);
            }}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
