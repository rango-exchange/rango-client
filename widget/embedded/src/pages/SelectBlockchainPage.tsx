import { i18n } from '@lingui/core';
import {
  Divider,
  getCountCategories,
  SelectableCategoryList,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { BlockchainList } from '../components/BlockchainList';
import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';

interface PropTypes {
  type: 'source' | 'destination';
}

export function SelectBlockchainPage(props: PropTypes) {
  const { type } = props;
  const navigateBack = useNavigateBack();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const [blockchainCategory, setBlockchainCategory] = useState<string>('ALL');
  const setToBlockchain = useQuoteStore.use.setToBlockchain();
  const setFromBlockchain = useQuoteStore.use.setFromBlockchain();
  const fetchStatus = useAppStore().fetchStatus;

  const blockchains = useAppStore().blockchains({
    type,
  });

  const countActiveCategories = getCountCategories(blockchains);

  const showCategory = countActiveCategories !== 1;

  return (
    <Layout
      header={{
        title: i18n.t(`Select Blockchain`),
      }}>
      <PageContainer view>
        {showCategory && (
          <>
            <SelectableCategoryList
              setCategory={setBlockchainCategory}
              category={blockchainCategory}
              blockchains={blockchains}
              isLoading={fetchStatus === 'loading'}
            />
            <Divider size={24} />
          </>
        )}

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
            navigateBack();
          }}
        />
      </PageContainer>
    </Layout>
  );
}
