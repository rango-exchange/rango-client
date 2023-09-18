import type { PropTypes, TokenWithBalance } from './TokenList.types';
import type { CommonProps } from 'react-window';

import { i18n } from '@lingui/core';
import {
  Divider,
  Image,
  ListItemButton,
  NotFound,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { forwardRef, useEffect, useState } from 'react';

import { useMetaStore } from '../../store/meta';

import { LoadingTokenList } from './LoadingTokenList';
import { filterTokens } from './TokenList.helpers';
import { BalanceContainer, Content, Tag, Title } from './TokenList.styles';

const PAGE_SIZE = 20;
const FIXED_HEIGHT = 16;
export function TokenList(props: PropTypes) {
  const { list, searchedFor = '', onChange } = props;
  const [tokens, setTokens] = useState<TokenWithBalance[]>(list);
  const loadingStatus = useMetaStore.use.loadingStatus();

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  // eslint-disable-next-line react/display-name
  const innerElementType: React.FC<CommonProps> = forwardRef((render, ref) => {
    return (
      <div
        {...render}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        style={{
          ...render.style,
          height: `${
            parseFloat(render.style?.height as string) + FIXED_HEIGHT
          }px`,
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
    setTokens(filterTokens(list, searchedFor));
  }, [list, searchedFor]);

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
        Item={({ index, style }) => (
          <ListItemButton
            style={style}
            key={`${tokens[index].symbol}${tokens[index].address}`}
            id={`${tokens[index].symbol}${tokens[index].address}`}
            onClick={() => onChange(tokens[index])}
            start={
              <Image src={tokens[index].image} size={30} type="circular" />
            }
            title={
              <Title>
                <Typography variant="title" size="xmedium">
                  {tokens[index].symbol}
                </Typography>
                <Divider direction="horizontal" size={4} />
                <Tag>
                  <Typography variant="body" size="xsmall">
                    {tokens[index].blockchain}
                  </Typography>
                </Tag>
              </Title>
            }
            description={tokens[index].name || undefined}
            end={
              tokens[index]?.balance && (
                <BalanceContainer>
                  <Typography variant="title" size="small">
                    {tokens[index].balance?.amount}
                  </Typography>
                  <div />
                  <Typography variant="body" color="neutral800" size="xsmall">
                    {`$${tokens[index].balance?.usdValue}`}
                  </Typography>
                </BalanceContainer>
              )
            }
          />
        )}
        hasNextPage={hasNextPage}
        itemCount={tokens.length}
        loadNextPage={loadNextPage}
        innerElementType={innerElementType}
        size={50}
      />
    );
  };

  return (
    <div>
      <Typography variant="label" size="large">
        {i18n.t('Select Token')}
      </Typography>
      <Divider size={4} />
      <Content>{renderList()}</Content>
    </div>
  );
}
