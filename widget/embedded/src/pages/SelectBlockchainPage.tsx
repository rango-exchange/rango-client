import { i18n } from '@lingui/core';
import { Divider } from '@rango-dev/ui';
import React, { useState } from 'react';

import { BlockchainList } from '../components/BlockchainList';
import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { SelectableCategoryList } from '../components/SelectableCategoryList';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';

interface PropTypes {
  type: 'from' | 'to';
  supportedBlockchains?: string[];
}

export function SelectBlockchainPage(props: PropTypes) {
  const { type, supportedBlockchains } = props;
  const { navigateBackFrom } = useNavigateBack();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const [blockchainCategory, setBlockchainCategory] = useState<string>('ALL');
  const setToBlockchain = useBestRouteStore.use.setToBlockchain();
  const setFromBlockchain = useBestRouteStore.use.setFromBlockchain();

  const blockchains = supportedBlockchains
    ? useMetaStore.use
        .meta()
        .blockchains.filter((chain) =>
          supportedBlockchains.includes(chain.name)
        )
    : useMetaStore.use.meta().blockchains;

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(
          null,
          navigationRoutes[`${type}Blockchain`]
        ),
        title: i18n.t(`Select Blockchain`),
      }}>
      <Divider size={12} />
      <SelectableCategoryList
        setCategory={setBlockchainCategory}
        category={blockchainCategory}
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
          if (type === 'from') {
            setFromBlockchain(blockchain, true);
          } else {
            setToBlockchain(blockchain, true);
          }
          navigateBackFrom(navigationRoutes[`${type}Blockchain`]);
        }}
      />
    </Layout>
  );
}
