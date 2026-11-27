import type { BlockchainMeta, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider, Spinner } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainsSection } from '../../components/BlockchainsSection';
import { Layout, PageContainer } from '../../components/Layout';
import { SearchInput } from '../../components/SearchInput';
import { TokenList } from '../../components/TokenList';
import { navigationRoutes } from '../../constants/navigationRoutes';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useSearchCustomTokens } from '../../hooks/useSearchCustomTokens';
import { useModeStrategy } from '../../modes';
import { useQuoteStore } from '../../store/quote';
import { UiEventTypes } from '../../types';
import { emitUiEvent } from '../../utils/events';

import {
  flattenTokenSections,
  getTokenSelectionMethod,
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
  } = useQuoteStore()();
  const { strategy, context } = useModeStrategy();
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
  const blockchains = strategy.blockchains({ ...context, type });
  const sections = strategy.tokenSections({
    ...context,
    type,
    blockchain: selectedBlockchain,
    searchFor: searchedFor,
  });
  const tokens = sections.flatMap((section) => section.tokens);
  const canSearchForCustomTokens = (tokens: Token[]) =>
    strategy.allowCustomTokens &&
    shouldSearchForCustomTokens(tokens, searchedFor, selectedBlockchain?.name);

  const rows = flattenTokenSections(sections);
  const modifiedTokens = strategy.allowCustomTokens
    ? prepareTokensList(
        rows,
        tokens,
        customTokens,
        searchedFor,
        loading,
        selectedBlockchain?.name
      )
    : rows;

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

  const side = type === 'source' ? 'from' : 'to';

  const emitChainFilterApplied = (blockchain: BlockchainMeta) => {
    emitUiEvent({
      type: UiEventTypes.CHAIN_FILTER_APPLIED,
      payload: { side, chain: blockchain.name, filterSource: 'featured' },
    });
  };

  const emitTokenSelected = (token: Token) => {
    emitUiEvent({
      type: UiEventTypes.TOKEN_SELECTED,
      payload: {
        side,
        tokenName: token.name,
        tokenSymbol: token.symbol,
        tokenAddress: token.address,
        chain: token.blockchain,
        selectionMethod: getTokenSelectionMethod(searchedFor),
        activeChainFilter: selectedBlockchainName || 'all',
      },
    });
  };

  const types = {
    source: i18n.t('Source'),
    destination: i18n.t('Destination'),
  };

  useEffect(() => {
    if (canSearchForCustomTokens(tokens)) {
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
            emitChainFilterApplied(blockchain);
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
            canSearchForCustomTokens(tokens) && loading ? (
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
          getItemOverrides={(token) =>
            strategy.tokenItem({
              ...context,
              token,
              sectionId: token.sectionId,
            })
          }
          onChange={(token) => {
            emitTokenSelected(token);
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
