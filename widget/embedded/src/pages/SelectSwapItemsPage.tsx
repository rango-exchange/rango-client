/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Asset } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  CloseIcon,
  Divider,
  IconButton,
  SearchIcon,
  TextField,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlockchainsSection } from '../components/BlockchainsSection';
import { Layout } from '../components/Layout';
import { TokenList } from '../components/TokenList/TokenList';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { tokensAreEqual } from '../utils/wallets';

interface PropTypes {
  type: 'from' | 'to';
  supportedChains?: string[];
  supportedTokens?: Asset[];
}

export function SelectSwapItemsPage(props: PropTypes) {
  const { type, supportedChains, supportedTokens } = props;
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const { tokens } = useMetaStore.use.meta();
  const sourceTokens = useBestRouteStore.use.sourceTokens();
  const destinationTokens = useBestRouteStore.use.destinationTokens();
  const [searchedFor, setSearchedFor] = useState<string>('');
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToToken = useBestRouteStore.use.setToToken();
  const setToChain = useBestRouteStore.use.setToChain();
  const setFromChain = useBestRouteStore.use.setFromChain();
  const toChain = useBestRouteStore.use.toChain();
  const fromChain = useBestRouteStore.use.fromChain();
  const blockchains = supportedChains
    ? useMetaStore.use
        .meta()
        .blockchains.filter((chain) => supportedChains.includes(chain.name))
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
  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.home),
        title: i18n.t(`Swap ${type}`),
      }}>
      <BlockchainsSection
        blockchains={blockchains}
        type={type}
        blockchain={type === 'from' ? fromChain : toChain}
        onMoreClick={() =>
          navigate(
            type === 'from'
              ? navigationRoutes.fromChain
              : navigationRoutes.toChain
          )
        }
        onChange={(blockchain) => {
          {
            if (type === 'from') {
              setFromChain(blockchain, true);
            } else {
              setToChain(blockchain, true);
            }
          }
        }}
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
        placeholder={i18n.t('Search Token')}
        color="light"
        variant="contained"
        size="large"
        onChange={(event) => setSearchedFor(event.target.value)}
      />
      <Divider size={16} />

      <TokenList
        list={tokensByType.length ? tokensByType : allTokens}
        searchedFor={searchedFor}
        onChange={(token) => {
          const blockchain = blockchains.find(
            (chain) => token.blockchain === chain.name
          );
          if (type === 'from') {
            setFromToken(token);
            if (!!blockchain) {
              setFromChain(blockchain, true);
            }
          } else {
            setToToken(token);
            if (!!blockchain) {
              setToChain(blockchain, true);
            }
          }
          navigateBackFrom(navigationRoutes.fromSwap);
        }}
      />
    </Layout>
  );
}
