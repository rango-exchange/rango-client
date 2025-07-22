import type { BlockchainMeta, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider, Spinner } from '@arlert-dev/ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainsSection } from '../../components/BlockchainsSection';
import { Layout, PageContainer } from '../../components/Layout';
import { SearchInput } from '../../components/SearchInput';
import { TokenList } from '../../components/TokenList';
import { navigationRoutes } from '../../constants/navigationRoutes';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useSearchCustomTokens } from '../../hooks/useSearchCustomTokens';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';

import {
  prepareTokensList,
  shouldSearchForCustomTokens,
} from './SelectSwapItemPage.helpers';

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
  const { getBalanceFor } = useAppStore();
  const {
    fetch,
    loading,
    tokens: customTokens,
    cancel,
  } = useSearchCustomTokens();
  const [searchedFor, setSearchedFor] = useState<string>('');

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
    getBalanceFor: getBalanceFor,
  });

  const modifiedTokens = prepareTokensList(
    tokens,
    customTokens,
    searchedFor,
    loading,
    selectedBlockchain?.name
  );

  const updateBlockchain = (blockchain: BlockchainMeta) => {
    if (type === 'source') {
      setFromBlockchain(blockchain);
    } else {
      setToBlockchain(blockchain);
    }
  };

  const updateToken = (token: Token) => {
    if (type === 'source') {
      setFromToken({ token, meta: { blockchains } });
    } else {
      setToToken({ token, meta: { blockchains } });
    }
  };
  const types = {
    source: i18n.t('Source'),
    destination: i18n.t('Destination'),
  };

  useEffect(() => {
    if (
      shouldSearchForCustomTokens(tokens, searchedFor, selectedBlockchain?.name)
    ) {
      fetch(searchedFor, selectedBlockchain?.name ?? undefined);
    }

    return () => {
      cancel();
    };
  }, [tokens.length, searchedFor, selectedBlockchain?.name]);

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
          id="widget-select-swap-item-search-input"
          autoFocus
          placeholder={i18n.t('Search Token')}
          color="light"
          variant="contained"
          size="large"
          setValue={() => setSearchedFor('')}
          onChange={(event) => setSearchedFor(event.target.value)}
          suffix={
            shouldSearchForCustomTokens(
              tokens,
              searchedFor,
              selectedBlockchain?.name
            ) && loading ? (
              <Spinner size={12} color="secondary" />
            ) : undefined
          }
        />
        <Divider size={16} />
        <TokenList
          list={modifiedTokens}
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
