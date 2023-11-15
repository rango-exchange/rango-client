import type { BlockchainMeta, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider } from '@rango-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainsSection } from '../components/BlockchainsSection';
import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { TokenList } from '../components/TokenList/TokenList';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useWalletsStore } from '../store/wallets';
import { getTokensBalanceFromWalletAndSort } from '../utils/wallets';

interface PropTypes {
  type: 'source' | 'destination';
}

export function SelectSwapItemsPage(props: PropTypes) {
  const { type } = props;
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const {
    fromBlockchain,
    toBlockchain,
    setFromToken,
    setToToken,
    setFromBlockchain,
    setToBlockchain,
  } = useQuoteStore();
  const { connectedWallets } = useWalletsStore();
  const [searchedFor, setSearchedFor] = useState<string>('');

  const selectedBlockchain = type === 'source' ? fromBlockchain : toBlockchain;
  const selectedBlockchainName = selectedBlockchain?.name ?? '';

  // Tokens & Blockchains list
  const blockchains = useAppStore().blockchains({
    type: type,
  });
  const tokens = useAppStore().tokens({
    type,
    blockchain: selectedBlockchainName,
    searchFor: searchedFor,
  });
  const tokensList = getTokensBalanceFromWalletAndSort(
    tokens,
    connectedWallets
  );

  // Actions
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

  return (
    <Layout
      header={{
        onBack: () =>
          navigateBackFrom(
            type === 'source'
              ? navigationRoutes.fromSwap
              : navigationRoutes.toSwap
          ),
        title: i18n.t('Swap {type}', {
          type: type === 'source' ? 'from' : 'to',
        }),
      }}>
      <BlockchainsSection
        blockchains={blockchains}
        type={type == 'source' ? 'from' : 'to'}
        blockchain={type === 'source' ? fromBlockchain : toBlockchain}
        onMoreClick={() =>
          navigate(
            type === 'source'
              ? navigationRoutes.fromBlockchain
              : navigationRoutes.toBlockchain
          )
        }
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
        onChange={(token) => {
          updateToken(token);

          const tokenBlockchain = blockchains.find(
            (chain) => token.blockchain === chain.name
          );
          if (tokenBlockchain) {
            updateBlockchain(tokenBlockchain);
          }

          navigateBackFrom(navigationRoutes.fromSwap);
        }}
      />
    </Layout>
  );
}
