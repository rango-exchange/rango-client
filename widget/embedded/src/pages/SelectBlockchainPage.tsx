import type { BlockchainMeta } from 'rango-types';

import { i18n } from '@lingui/core';
import {
  Divider,
  getCategoriesCount,
  SelectableCategoryList,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainList } from '../components/BlockchainList';
import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSwapMode } from '../hooks/useSwapMode';
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
  const setToBlockchain = useQuoteStore().use.setToBlockchain();
  const setFromBlockchain = useQuoteStore().use.setFromBlockchain();
  const setToToken = useQuoteStore().use.setToToken();
  const { fetchStatus, findNativeToken } = useAppStore();
  const navigate = useNavigate();
  const swapMode = useSwapMode();

  const blockchains = useAppStore().blockchains({
    type,
  });
  const activeCategoriesCount = getCategoriesCount(blockchains);

  const showCategory = !props.hideCategory && activeCategoriesCount !== 1;

  const handleBlockchainChange = (blockchain: BlockchainMeta) => {
    if (type === 'custom-token') {
      navigate(`..?blockchain=${blockchain.name}`, { replace: true });
    } else {
      if (type === 'source') {
        setFromBlockchain(blockchain);
      } else {
        if (swapMode === 'swap') {
          setToBlockchain(blockchain);
        } else {
          const blockchainNativeToken = findNativeToken(blockchain);
          if (blockchainNativeToken) {
            setToToken({ token: blockchainNativeToken, meta: { blockchains } });
          }
        }
      }
      navigateBack();
    }
  };

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
          onChange={handleBlockchainChange}
        />
      </PageContainer>
    </Layout>
  );
}
