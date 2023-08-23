import type { PropTypes, TokenWithAmount } from './TokenList.types';
import type { CommonProps } from 'react-window';

import { i18n } from '@lingui/core';
import {
  Divider,
  Image,
  ListItem,
  ListItemButton,
  NotFound,
  Skeleton,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { forwardRef, useEffect, useState } from 'react';

import { useMetaStore } from '../../store/meta';

import { filterTokens } from './TokenList.helpers';
import {
  BalanceContainer,
  Content,
  End,
  List,
  Tag,
  Title,
} from './TokenList.styles';

const PAGE_SIZE = 20;
const Fixed_Height = 16;
export function TokenList(props: PropTypes) {
  const { list, searchedFor, onChange } = props;
  const [tokens, setTokens] = useState<TokenWithAmount[]>(list);
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
            parseFloat(render.style?.height as string) + Fixed_Height
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

  return (
    <div>
      <Typography variant="label" size="large">
        {i18n.t('Select Token')}
      </Typography>
      <Divider size={4} />
      <Content>
        {loadingStatus === 'loading' ? (
          <List>
            {Array.from(Array(PAGE_SIZE), (e) => (
              <ListItem
                key={e}
                start={<Skeleton variant="circular" width={35} height={35} />}
                end={
                  <End>
                    <Skeleton variant="text" size="large" width={90} />
                    <Divider size={4} />
                    <Skeleton variant="text" size="medium" width={60} />
                  </End>
                }
                title={
                  <div>
                    <Skeleton variant="text" size="large" width={90} />
                    <Divider size={4} />
                    <Skeleton variant="text" size="medium" width={90} />
                  </div>
                }
              />
            ))}
          </List>
        ) : !tokens.length && !!searchedFor.length ? (
          <>
            <Divider size={32} />
            <NotFound
              title={i18n.t('No results found')}
              subTitle={i18n.t('Try using different keywords')}
            />
          </>
        ) : (
          <VirtualizedList
            Item={({ index, style }) => (
              <ListItemButton
                style={style}
                key={`${tokens[index].symbol}${tokens[index].address}`}
                id={`${tokens[index].symbol}${tokens[index].address}`}
                onClick={() => onChange(tokens[index])}
                start={<Image src={tokens[index].image} size={30} />}
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
                      <Typography
                        variant="body"
                        color="neutral400"
                        size="xsmall">
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
        )}
      </Content>
    </div>
  );
}
