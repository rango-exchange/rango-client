/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes, RenderDescProps } from './TokenList.types';
import type { BlockchainMeta, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  darkTheme,
  Divider,
  ExternalLinkIcon,
  Image,
  ListItemButton,
  NotFound,
  PinIcon,
  Skeleton,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { useObserveBalanceChanges } from '../../hooks/useObserveBalanceChanges';
import { useAppStore } from '../../store/AppStore';
import { useWalletsStore } from '../../store/wallets';
import { createTintsAndShades } from '../../utils/colors';
import { formatBalance } from '../../utils/wallets';

import { LoadingTokenList } from './LoadingTokenList';
import {
  BalanceContainer,
  Container,
  descriptionStyles,
  End,
  ImageSection,
  List,
  Pin,
  StyledLink,
  Tag,
  TagTitle,
  Title,
  tokenAddressStyles,
  TokenBalance,
  tokenNameStyles,
  tokenTitleStyles,
  tokenWithoutNameStyles,
  usdValueStyles,
} from './TokenList.styles';

const PAGE_SIZE = 20;

const renderDesc = (props: RenderDescProps) => {
  const { address, name, url, token, customCssForTag, customCssForTagTitle } =
    props;
  const length = address.length;

  return (
    <div className={descriptionStyles()}>
      {name ? (
        <div className={tokenNameStyles()}>{name}</div>
      ) : (
        <Title className={tokenTitleStyles()}>
          <Typography variant="title" size="xmedium">
            {token.symbol}
          </Typography>
          <Divider direction="horizontal" size={4} />
          <Tag css={customCssForTag}>
            <TagTitle variant="body" size="xsmall" css={customCssForTagTitle}>
              {token.blockchain}
            </TagTitle>
          </Tag>
        </Title>
      )}

      {!!address && (
        <div
          className={`${tokenAddressStyles()} ${
            !name && tokenWithoutNameStyles()
          }`}>
          {length > 10
            ? `${address.slice(0, 5)}...${address.slice(length - 6, length)}`
            : address}{' '}
          <Divider size={4} direction="horizontal" />
          <StyledLink
            href={url}
            target="_blank"
            rel="nofollow noreferrer"
            onClick={(e) => e.stopPropagation()}>
            <ExternalLinkIcon size={12} />
          </StyledLink>
        </div>
      )}
    </div>
  );
};

export function TokenList(props: PropTypes) {
  const { list, searchedFor = '', onChange, selectedBlockchain } = props;

  const [tokens, setTokens] = useState<Token[]>(list);
  const fetchStatus = useAppStore().fetchStatus;
  const blockchains = useAppStore().blockchains();
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const { getBalanceFor, loading: loadingWallet } = useWalletsStore();
  const { isTokenPinned } = useAppStore();
  /**
   * We can create the key by hashing the list of tokens,
   * but if the list is large, the memory usage and cost of comparisons may be high.
   */
  const { balanceKey } = useObserveBalanceChanges(selectedBlockchain);

  const loadNextPage = () => {
    setTokens(list.slice(0, tokens.length + PAGE_SIZE));
  };

  useEffect(() => {
    setHasNextPage(list.length > tokens.length);
  }, [tokens.length]);

  useEffect(() => {
    setTokens(list.slice(0, PAGE_SIZE));
  }, [list.length, selectedBlockchain, balanceKey]);

  const renderList = () => {
    if (!tokens.length && !!searchedFor) {
      return (
        <>
          <Divider size={32} />
          <NotFound
            title={i18n.t('No results found')}
            description={i18n.t('Try using different keywords')}
          />
        </>
      );
    }
    return (
      <VirtualizedList
        endReached={hasNextPage ? loadNextPage : undefined}
        itemContent={(index) => {
          const token = tokens[index];
          const tokenBalance = formatBalance(getBalanceFor(token));
          const address = token.address || '';
          const blockchain = blockchains.find(
            (blockchain) => blockchain.name === token.blockchain
          ) as BlockchainMeta;
          const colors = createTintsAndShades(blockchain.color, 'main');
          const customCssForTag = {
            $$color: colors.main150,
            [`.${darkTheme} &`]: {
              $$color: colors.main750,
            },
            backgroundColor: '$$color',
          };

          const customCssForTagTitle = {
            $$color: colors.main750,
            [`.${darkTheme} &`]: {
              $$color: colors.main150,
            },
            color: '$$color',
          };

          return (
            <div
              style={{
                paddingRight: 5,
              }}>
              <ListItemButton
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  height: '60px',
                }}
                tab-index={index}
                key={`${token.symbol}${token.address}`}
                id={`${token.symbol}${token.address}`}
                hasDivider
                onClick={() => onChange(tokens[index])}
                start={
                  <ImageSection>
                    <Image src={token.image} size={30} />
                    {isTokenPinned(token, props.type) && (
                      <Pin>
                        <PinIcon size={12} color="gray" />
                      </Pin>
                    )}
                  </ImageSection>
                }
                title={
                  blockchain?.type === 'COSMOS' ||
                  !!token.name ||
                  (!token.name && !address) ? (
                    <Title>
                      <Typography variant="title" size="xmedium">
                        {token.symbol}
                      </Typography>
                      <Divider direction="horizontal" size={4} />
                      <Tag css={customCssForTag}>
                        <TagTitle
                          variant="body"
                          size="xsmall"
                          css={customCssForTagTitle}>
                          {token.blockchain}
                        </TagTitle>
                      </Tag>
                    </Title>
                  ) : undefined
                }
                description={
                  !!blockchain?.info &&
                  !!address &&
                  blockchain.type !== 'COSMOS'
                    ? renderDesc({
                        address,
                        token: tokens[index],
                        customCssForTag,
                        customCssForTagTitle,
                        name: token.name,
                        url: blockchain.info.addressUrl
                          .split('{wallet}')
                          .join(address),
                      })
                    : token.name || undefined
                }
                end={
                  loadingWallet ? (
                    <End>
                      <Skeleton variant="text" size="large" width={70} />
                      <Divider size={4} />
                      <Skeleton variant="text" size="medium" width={50} />
                    </End>
                  ) : (
                    tokenBalance && (
                      <BalanceContainer>
                        <TokenBalance variant="title" size="small">
                          {tokenBalance.amount}
                        </TokenBalance>
                        <div />
                        {tokenBalance.usdValue && (
                          <Typography
                            variant="body"
                            className={usdValueStyles()}
                            size="xsmall">
                            {`$${tokenBalance.usdValue}`}
                          </Typography>
                        )}
                      </BalanceContainer>
                    )
                  )
                }
              />
            </div>
          );
        }}
        totalCount={tokens.length}
        key={`${selectedBlockchain}-${searchedFor}-${balanceKey}`}
      />
    );
  };

  return (
    <Container>
      <Typography variant="label" size="large">
        {i18n.t('Select Token')}
      </Typography>
      <Divider size={4} />
      {fetchStatus === 'loading' && <LoadingTokenList size={PAGE_SIZE} />}
      {fetchStatus === 'success' && <List as="ul">{renderList()}</List>}
    </Container>
  );
}
