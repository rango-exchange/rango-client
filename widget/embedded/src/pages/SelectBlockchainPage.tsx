import { i18n } from '@lingui/core';
import { Divider, SelectableCategoryList } from '@rango-dev/ui';
import React, { useState } from 'react';

import { BlockchainList } from '../components/BlockchainList';
import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';

interface PropTypes {
  type: 'source' | 'destination';
}

export function SelectBlockchainPage(props: PropTypes) {
  const { type } = props;
  const { navigateBackFrom } = useNavigateBack();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const [blockchainCategory, setBlockchainCategory] = useState<string>('ALL');
  const setToBlockchain = useQuoteStore.use.setToBlockchain();
  const setFromBlockchain = useQuoteStore.use.setFromBlockchain();
  const loadingStatus = useAppStore().use.loadingStatus();

  const blockchains = useAppStore().use.blockchains()({
    type: type,
  });
  const routeKey = type === 'source' ? 'fromBlockchain' : 'toBlockchain';

  return (
    <Layout
      header={{
        onBack: () => {
          navigateBackFrom(navigationRoutes[routeKey]);
        },
        title: i18n.t(`Select Blockchain`),
      }}>
      <Divider size={12} />
      <SelectableCategoryList
        setCategory={setBlockchainCategory}
        category={blockchainCategory}
        blockchains={blockchains}
        isLoading={loadingStatus === 'loading'}
      />
      <Divider size={24} />
      <SearchInput
        value={searchedFor}
        autoFocus
        placeholder={i18n.t('Search Blockchain')}
        color="light"
        variant="contained"
        size="large"
        setValue={() => setSearchedFor('')}
        onChange={(event) => setSearchedFor(event.target.value)}
      />
      <Divider size={16} />

      <BlockchainList
        list={blockchains}
        searchedFor={searchedFor}
        blockchainCategory={blockchainCategory}
        onChange={(blockchain) => {
          if (type === 'source') {
            setFromBlockchain(blockchain);
          } else {
            setToBlockchain(blockchain);
          }

          navigateBackFrom(navigationRoutes[routeKey]);
        }}
      />
    </Layout>
  );
}
