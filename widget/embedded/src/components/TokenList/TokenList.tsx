/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {
  PropTypes,
  RenderDescProps,
  // RenderDescProps,
  TokenWithBalance,
} from './TokenList.types';
import type { CommonProps } from 'react-window';

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
import React, { forwardRef, useEffect, useState } from 'react';

import { useMetaStore } from '../../store/meta';
import { useWalletsStore } from '../../store/wallets';
import { generateRangeColors } from '../../utils/common';

import { LoadingTokenList } from './LoadingTokenList';
import {
  BalanceContainer,
  End,
  ImageSection,
  List,
  Pin,
  Tag,
  TagTitle,
  Title,
} from './TokenList.styles';

const PAGE_SIZE = 20;

const renderDesc = (props: RenderDescProps) => {
  const { address, name, url, token, customCssForTag, customCssForTagTitle } =
    props;
  const length = address.length;

  return (
    <div className="description">
      {name ? (
        <div className="token-name">{name}</div>
      ) : (
        <Title className="token-title">
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
          className={`token-address ${!name && 'token-address-without-name'}`}>
          <a
            href={url}
            target="_blank"
            rel="nofollow noreferrer"
            onClick={(e) => e.stopPropagation()}>
            {length > 10
              ? `${address.slice(0, 5)}...${address.slice(length - 6, length)}`
              : address}{' '}
            <ExternalLinkIcon color="gray" size={12} />
          </a>
        </div>
      )}
    </div>
  );
};

export function TokenList(props: PropTypes) {
  const { list, searchedFor = '', onChange } = props;

  const [tokens, setTokens] = useState<TokenWithBalance[]>(list);
  const loadingStatus = useMetaStore.use.loadingStatus();
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const loadingWallet = useWalletsStore.use.loading();
  const { blockchains } = useMetaStore.use.meta();

  // eslint-disable-next-line react/display-name
  const innerElementType: React.FC<CommonProps> = forwardRef((render, ref) => {
    return (
      <div
        {...render}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        style={{
          ...render.style,
          height: `${parseFloat(render.style?.height as string) + 8 * 2}px`,
        }}
      />
    );
  });
  const loadNextPage = () => {
    setTokens(list.slice(0, tokens.length + PAGE_SIZE));
  };

  useEffect(() => {
    setHasNextPage(list.length > tokens.length);
  }, [tokens.length]);

  useEffect(() => {
    setTokens(list.slice(0, PAGE_SIZE));
  }, [list]);

  const renderList = () => {
    if (loadingStatus === 'loading') {
      return <LoadingTokenList size={PAGE_SIZE} />;
    } else if (!tokens.length && !!searchedFor) {
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
        Item={({ index, style }) => {
          const address = tokens[index].address || '';
          const blockchain = blockchains.find(
            (blockchain) => blockchain.name === tokens[index].blockchain
          );
          const color = generateRangeColors(
            tokens[index].symbol,
            blockchain?.color || ''
          );

          const customCssForTag = {
            $$color: color[`${tokens[index].symbol}100`],
            [`.${darkTheme} &`]: {
              $$color: color[`${tokens[index].symbol}900`],
            },
            backgroundColor: '$$color',
          };

          const customCssForTagTitle = {
            $$color: color[`${tokens[index].symbol}700`],
            [`.${darkTheme} &`]: {
              $$color: color[`${tokens[index].symbol}100`],
            },
            color: '$$color',
          };

          return (
            <div
              style={{
                ...style,
                paddingRight: 5,
              }}>
              <ListItemButton
                style={{
                  height: style?.height,
                }}
                tab-index={index}
                key={`${tokens[index].symbol}${tokens[index].address}`}
                id={`${tokens[index].symbol}${tokens[index].address}`}
                hasDivider
                onClick={() => onChange(tokens[index])}
                start={
                  <ImageSection>
                    <Image src={tokens[index].image} size={30} />
                    {tokens[index].pin && (
                      <Pin>
                        <PinIcon size={12} color="gray" />
                      </Pin>
                    )}
                  </ImageSection>
                }
                title={
                  blockchain?.type === 'COSMOS' ||
                  !!tokens[index].name ||
                  (!tokens[index].name && !address) ? (
                    <Title>
                      <Typography variant="title" size="xmedium">
                        {tokens[index].symbol}
                      </Typography>
                      <Divider direction="horizontal" size={4} />
                      <Tag css={customCssForTag}>
                        <TagTitle
                          variant="body"
                          size="xsmall"
                          css={customCssForTagTitle}>
                          {tokens[index].blockchain}
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
                        name: tokens[index].name,
                        url: blockchain.info.addressUrl
                          .split('{wallet}')
                          .join(address),
                      })
                    : tokens[index].name || undefined
                }
                end={
                  loadingWallet ? (
                    <End>
                      <Skeleton variant="text" size="large" width={70} />
                      <Divider size={4} />
                      <Skeleton variant="text" size="medium" width={50} />
                    </End>
                  ) : (
                    tokens[index]?.balance && (
                      <BalanceContainer>
                        <Typography variant="title" size="small">
                          {tokens[index].balance?.amount}
                        </Typography>
                        <div />
                        {tokens[index].balance?.usdValue && (
                          <Typography
                            variant="body"
                            color="neutral800"
                            size="xsmall">
                            {`$${tokens[index].balance?.usdValue}`}
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
        hasNextPage={hasNextPage}
        itemCount={tokens.length}
        loadNextPage={loadNextPage}
        innerElementType={innerElementType}
        size={60}
      />
    );
  };

  return (
    <div>
      <Typography variant="label" size="large">
        {i18n.t('Select Token')}
      </Typography>
      <Divider size={4} />
      <List>{renderList()}</List>
    </div>
  );
}
