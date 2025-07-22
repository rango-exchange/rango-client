import { i18n } from '@lingui/core';
import {
  Divider,
  getCategoriesCount,
  SelectableCategoryList,
} from '@arlert-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainList } from '../components/BlockchainList';
import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';

interface PropTypes {
  type: 'source' | 'destination' | 'custom-token';
  hideCategory?: boolean;
}

export function SelectBlockchainPage(props: PropTypes) {
  const { type } = props;
  const navigateBack = useNavigateBack();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const [blockchainCategory, setBlockchainCategory] = useState<string>('ALL');
  const setToBlockchain = useQuoteStore.use.setToBlockchain();
  const setFromBlockchain = useQuoteStore.use.setFromBlockchain();
  const { fetchStatus } = useAppStore();
  const navigate = useNavigate();

  const blockchains = useAppStore().blockchains({
    type,
  });
  const activeCategoriesCount = getCategoriesCount(blockchains);

  const showCategory = !props.hideCategory && activeCategoriesCount !== 1;

  return (
    <Layout
      header={{
        title: i18n.t(`Select Chain`),
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
          placeholder={i18n.t('Search Chain')}
          id="widget-select-blockchain-search-input"
          color="light"
          variant="contained"
          size="large"
          setValue={() => setSearchedFor('')}
          onChange={(event) => setSearchedFor(event.target.value)}
        />
        <Divider size={16} />

        <BlockchainList
          list={blockchains}
          showTitle={type !== 'custom-token'}
          searchedFor={searchedFor}
          blockchainCategory={blockchainCategory}
          onChange={(blockchain) => {
            if (type === 'custom-token') {
              navigate(`..?blockchain=${blockchain.name}`, { replace: true });
            } else {
              if (type === 'source') {
                setFromBlockchain(blockchain);
              } else {
                setToBlockchain(blockchain);
              }
              navigateBack();
            }
          }}
        />
      </PageContainer>
    </Layout>
  );
}
