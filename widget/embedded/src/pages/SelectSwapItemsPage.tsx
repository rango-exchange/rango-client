/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Asset, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainsSection } from '../components/BlockchainsSection';
import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { TokenList } from '../components/TokenList/TokenList';
import { filterTokens } from '../components/TokenList/TokenList.helpers';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useWalletsStore } from '../store/wallets';
import { findCommonTokens } from '../utils/routing';
import { tokensAreEqual } from '../utils/wallets';

interface PropTypes {
  type: 'from' | 'to';
  supportedBlockchains?: string[];
  supportedTokens?: Asset[];
  pinnedTokens?: Asset[];
}

export function SelectSwapItemsPage(props: PropTypes) {
  const { type, supportedBlockchains, supportedTokens, pinnedTokens } = props;
  const [selectedBlockchain, setSelectedBlockchain] = useState('');
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const {
    meta: { tokens },
    setTokensWithBalance,
  } = useMetaStore();
  const {
    sourceTokens,
    destinationTokens,
    fromBlockchain,
    toBlockchain,
    setFromToken,
    setToToken,
    setFromBlockchain,
    setToBlockchain,
  } = useBestRouteStore();
  const { connectedWallets, loading: loadingWallet } = useWalletsStore();
  const [searchedFor, setSearchedFor] = useState<string>('');

  const blockchains = supportedBlockchains
    ? useMetaStore.use
        .meta()
        .blockchains.filter((chain) =>
          supportedBlockchains.includes(chain.name)
        )
    : useMetaStore.use.meta().blockchains;

  const allTokens = supportedTokens
    ? findCommonTokens(supportedTokens, tokens)
    : tokens.filter((token) =>
        new Set(blockchains.map((blockchain) => blockchain.name)).has(
          token.blockchain
        )
      );

  const supportedSourceTokens = supportedTokens
    ? findCommonTokens(supportedTokens, sourceTokens)
    : sourceTokens;

  const supportedDestinationTokens = supportedTokens
    ? findCommonTokens(supportedTokens, destinationTokens)
    : destinationTokens;

  const tokensByType =
    type === 'from' ? supportedSourceTokens : supportedDestinationTokens;

  let tokenList: Token[] = [];

  const noBlockchainSelected =
    (type === 'from' && !fromBlockchain) || (type === 'to' && !toBlockchain);

  if (noBlockchainSelected) {
    tokenList = allTokens;
  } else if (tokensByType.length) {
    tokenList = tokensByType.map((token) => ({
      ...token,
      pin: pinnedTokens?.some((pinnedToken) =>
        tokensAreEqual(pinnedToken, token)
      ),
    }));
  }

  useEffect(() => {
    if (connectedWallets.length && !loadingWallet) {
      setTokensWithBalance();
    }
  }, [connectedWallets, loadingWallet]);

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.home),
        title: i18n.t('Swap {type}', { type }),
      }}>
      <BlockchainsSection
        blockchains={blockchains}
        type={type}
        blockchain={type === 'from' ? fromBlockchain : toBlockchain}
        onMoreClick={() =>
          navigate(
            type === 'from'
              ? navigationRoutes.fromBlockchain
              : navigationRoutes.toBlockchain
          )
        }
        onChange={(blockchain) => {
          {
            if (type === 'from') {
              setFromBlockchain(blockchain, true);
            } else {
              setToBlockchain(blockchain, true);
            }
            setSelectedBlockchain(blockchain.name);
          }
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
        list={filterTokens(tokenList, searchedFor)}
        selectedBlockchain={selectedBlockchain}
        searchedFor={searchedFor}
        onChange={(token) => {
          const blockchain = blockchains.find(
            (chain) => token.blockchain === chain.name
          );
          if (type === 'from') {
            setFromToken(token);
            if (!!blockchain) {
              setFromBlockchain(blockchain, true);
            }
          } else {
            setToToken(token);
            if (!!blockchain) {
              setToBlockchain(blockchain, true);
            }
          }
          navigateBackFrom(navigationRoutes.fromSwap);
        }}
      />
    </Layout>
  );
}
