import { i18n } from '@lingui/core';
import {
  CloseIcon,
  Divider,
  IconButton,
  SearchIcon,
  TextField,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { BlockchainList } from '../components/BlockchainList';
import { Layout } from '../components/Layout';
import { SelectableCategoryList } from '../components/SelectableCategoryList';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';

interface PropTypes {
  type: 'from' | 'to';
  supportedChains?: string[];
}

export function SelectBlockchainPage(props: PropTypes) {
  const { type, supportedChains } = props;
  const { navigateBackFrom } = useNavigateBack();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const [blockchainCategory, setBlockchainCategory] = useState<string>('ALL');
  const setToChain = useBestRouteStore.use.setToChain();
  const setFromChain = useBestRouteStore.use.setFromChain();

  const blockchains = supportedChains
    ? useMetaStore.use
        .meta()
        .blockchains.filter((chain) => supportedChains.includes(chain.name))
    : useMetaStore.use.meta().blockchains;

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes[`${type}Chain`]),
        title: i18n.t(`Select chain`),
      }}>
      <Divider size={12} />
      <SelectableCategoryList
        setCategory={setBlockchainCategory}
        category={blockchainCategory}
      />
      <Divider size={24} />
      <TextField
        value={searchedFor}
        prefix={<SearchIcon size={24} color={'black'} />}
        suffix={
          !!searchedFor.length && (
            <IconButton variant="ghost" onClick={() => setSearchedFor('')}>
              <CloseIcon color="gray" size={10} />
            </IconButton>
          )
        }
        placeholder={i18n.t('Search Chain')}
        color="light"
        variant="contained"
        size="large"
        onChange={(event) => setSearchedFor(event.target.value)}
      />
      <Divider size={16} />

      <BlockchainList
        list={blockchains}
        searchedFor={searchedFor}
        blockchainCategory={blockchainCategory}
        onChange={(blockchain) => {
          if (type === 'from') {
            setFromChain(blockchain, true);
          } else {
            setToChain(blockchain, true);
          }
          navigateBackFrom(navigationRoutes[`${type}Chain`]);
        }}
      />
    </Layout>
  );
}
