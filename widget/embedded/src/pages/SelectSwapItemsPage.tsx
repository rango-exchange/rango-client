import type { BlockchainMeta, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider } from '@rango-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainsSection } from '../components/BlockchainsSection';
import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { TokenList } from '../components/TokenList/TokenList';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useWalletsStore } from '../store/wallets';
import { sortTokens } from '../utils/wallets';

interface PropTypes {
  type: 'source' | 'destination';
}

export function SelectSwapItemsPage(props: PropTypes) {
  const { type } = props;
  const navigate = useNavigate();
  const navigateBack = useNavigateBack();
  const {
    fromBlockchain,
    toBlockchain,
    setFromToken,
    setToToken,
    setFromBlockchain,
    setToBlockchain,
  } = useQuoteStore();
  const getBalanceFor = useWalletsStore.use.getBalanceFor();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const { isTokenPinned } = useAppStore();

  const selectedBlockchain = type === 'source' ? fromBlockchain : toBlockchain;
  const selectedBlockchainName = selectedBlockchain?.name ?? '';

  // Tokens & Blockchains list
  const blockchains = useAppStore().blockchains({
    type,
  });
  const tokens = useAppStore().tokens({
    type,
    blockchain: selectedBlockchainName,
    searchFor: searchedFor,
  });

  const checkIsTokenPinned = (token: Token) => isTokenPinned(token, type);

  const tokensList = sortTokens(tokens, getBalanceFor, checkIsTokenPinned);

  const updateBlockchain = (blockchain: BlockchainMeta) => {
    if (type === 'source') {
      setFromBlockchain(blockchain);
    } else {
      setToBlockchain(blockchain);
    }
  };

  const updateToken = (token: Token) => {
    if (type === 'source') {
      setFromToken({ token, meta: { blockchains, tokens } });
    } else {
      setToToken({ token, meta: { blockchains, tokens } });
    }
  };
  const types = {
    source: i18n.t('Source'),
    destination: i18n.t('Destination'),
  };

  return (
    <Layout
      header={{
        title: i18n.t('Swap {type}', { type: types[type] }),
      }}>
      <PageContainer>
        <BlockchainsSection
          blockchains={blockchains}
          type={type == 'source' ? 'from' : 'to'}
          blockchain={type === 'source' ? fromBlockchain : toBlockchain}
          onMoreClick={() => navigate(navigationRoutes.blockchains)}
          onChange={(blockchain) => {
            updateBlockchain(blockchain);
          }}
        />
        <Divider size={24} />
        <SearchInput
          value={searchedFor}
          autoFocus
          placeholder={i18n.t('Search Token')}
          color="light"
          variant="contained"
          size="large"
          setValue={() => setSearchedFor('')}
          onChange={(event) => setSearchedFor(event.target.value)}
        />
        <Divider size={16} />
        <TokenList
          list={tokensList}
          selectedBlockchain={selectedBlockchainName}
          searchedFor={searchedFor}
          type={type}
          onChange={(token) => {
            updateToken(token);

            const tokenBlockchain = blockchains.find(
              (chain) => token.blockchain === chain.name
            );
            if (tokenBlockchain) {
              updateBlockchain(tokenBlockchain);
            }

            navigateBack();
          }}
        />
      </PageContainer>
    </Layout>
  );
}
