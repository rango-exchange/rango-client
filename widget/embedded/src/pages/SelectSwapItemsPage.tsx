/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Asset } from 'rango-sdk';

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
import { tokensAreEqual } from '../utils/wallets';

interface PropTypes {
  type: 'from' | 'to';
  supportedBlockchains?: string[];
  supportedTokens?: Asset[];
  pinnedTokens?: Asset[];
}

export function SelectSwapItemsPage(props: PropTypes) {
  const { type, supportedBlockchains, supportedTokens, pinnedTokens } = props;
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const { tokens } = useMetaStore.use.meta();
  const sourceTokens = useBestRouteStore.use.sourceTokens();
  const destinationTokens = useBestRouteStore.use.destinationTokens();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToToken = useBestRouteStore.use.setToToken();
  const setToBlockchain = useBestRouteStore.use.setToBlockchain();
  const setFromBlockchain = useBestRouteStore.use.setFromBlockchain();
  const toBlockchain = useBestRouteStore.use.toBlockchain();
  const fromBlockchain = useBestRouteStore.use.fromBlockchain();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const loadingWallet = useWalletsStore.use.loading();
  const setTokensWithBalance = useMetaStore.use.setTokensWithBalance();

  const blockchains = supportedBlockchains
    ? useMetaStore.use
        .meta()
        .blockchains.filter((chain) =>
          supportedBlockchains.includes(chain.name)
        )
    : useMetaStore.use.meta().blockchains;
  const allTokens = supportedTokens
    ? tokens.filter((token) =>
        tokens.some((supportedToken) => tokensAreEqual(supportedToken, token))
      )
    : tokens;
  const supportedSourceTokens = supportedTokens
    ? sourceTokens.filter((token) =>
        supportedTokens.some((supportedToken) =>
          tokensAreEqual(supportedToken, token)
        )
      )
    : sourceTokens;

  const supportedDestinationTokens = supportedTokens
    ? destinationTokens.filter((token) =>
        supportedTokens.some((supportedToken) =>
          tokensAreEqual(supportedToken, token)
        )
      )
    : destinationTokens;

  const tokensByType =
    type === 'from' ? supportedSourceTokens : supportedDestinationTokens;

  const tokenList = (tokensByType.length ? tokensByType : allTokens).map(
    (token) => ({
      ...token,
      pin: pinnedTokens?.some((pinnedToken) =>
        tokensAreEqual(pinnedToken, token)
      ),
    })
  );

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
