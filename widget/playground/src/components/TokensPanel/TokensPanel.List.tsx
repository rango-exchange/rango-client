import type { TokensListProps, TokenType } from './TokensPanel.types';

import {
  Checkbox,
  CloseIcon,
  Divider,
  IconButton,
  Image,
  ListItemButton,
  NotFound,
  SearchIcon,
  Switch,
  TextField,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import {
  IconWrapper,
  SelectButton,
  SelectDeselectText,
} from '../MultiList/MultiList.styles';
import { InnerElementType } from '../SingleList';
import { EmptyContainer } from '../SingleList/SingleList.styles';

import { ListContainer, TokensHeaderList } from './TokensPanel.styles';

const PAGE_SIZE = 20;
const ITEM_HEIGHT = 46;
export function TokensList(props: TokensListProps) {
  const {
    list,
    onChange,
    onChangeAll,
    showSelectedTokens,
    setShowSelectedTokens,
    isAllSelected,
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const [virtualList, setVirtualList] = useState(list);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Filter tokens based on search criteria
  const filteredTokens = searchValue
    ? list.filter((token) =>
        token.symbol.toLowerCase().includes(searchValue.toLowerCase())
      )
    : list;

  // Tokens to display, either all or selected
  const tokensToDisplay = showSelectedTokens
    ? filteredTokens.filter((token) => token.checked)
    : filteredTokens;

  useEffect(() => {
    setHasNextPage(tokensToDisplay.length > virtualList.length);
  }, [virtualList.length]);

  useLayoutEffect(() => {
    setVirtualList(tokensToDisplay.slice(0, PAGE_SIZE));
  }, [searchValue, showSelectedTokens, list]);

  const loadNextPage = () => {
    setVirtualList(tokensToDisplay.slice(0, virtualList.length + PAGE_SIZE));
  };

  const toggleTokenSelection = (token: TokenType) => {
    onChange(token);
  };

  // Toggle displaying selected tokens
  const toggleShowSelectedTokens = () => {
    setShowSelectedTokens(!showSelectedTokens);
  };

  const resultsNotFound = !virtualList.length && !!searchValue;

  return (
    <>
      <TextField
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        variant="contained"
        placeholder="Search Tokens"
        prefix={
          <IconWrapper>
            <SearchIcon color="gray" />
          </IconWrapper>
        }
        suffix={
          <IconButton
            variant="ghost"
            onClick={() => setSearchValue('')}
            size="small">
            {!!searchValue.length && <CloseIcon color="gray" size={10} />}
          </IconButton>
        }
        style={{
          padding: 10,
          borderRadius: 25,
          alignItems: 'center',
        }}
      />
      <Divider size={12} />
      {resultsNotFound ? (
        <EmptyContainer>
          <NotFound
            title="No results found"
            description="Try using different keywords"
          />
        </EmptyContainer>
      ) : (
        <>
          <TokensHeaderList>
            <SelectButton onClick={() => onChangeAll(!isAllSelected)}>
              <SelectDeselectText
                variant="label"
                size="medium"
                color="neutral900">
                {isAllSelected ? 'Deselect all' : 'Select all'}
              </SelectDeselectText>
            </SelectButton>
            <div className="select_tokens">
              <Typography size="medium" variant="label" color="neutral900">
                Selected Tokens
              </Typography>
              <Divider direction="horizontal" size={4} />
              <Switch
                checked={showSelectedTokens}
                onChange={toggleShowSelectedTokens}
              />
            </div>
          </TokensHeaderList>
          <Divider size={12} />
          <ListContainer>
            <VirtualizedList
              Item={({ index, style }) => {
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
                      start={
                        virtualList[index].image ? (
                          <Image
                            src={virtualList[index].image}
                            size={16}
                            type="circular"
                          />
                        ) : null
                      }
                      hasDivider
                      onClick={() => toggleTokenSelection(virtualList[index])}
                      end={<Checkbox checked={virtualList[index].checked} />}
                      title={
                        <Typography variant="title" size="small">
                          {virtualList[index].symbol}
                        </Typography>
                      }
                      key={`${virtualList[index].symbol}${virtualList[index].address}`}
                      id={`${virtualList[index].symbol}${virtualList[index].address}`}
                    />
                  </div>
                );
              }}
              hasNextPage={hasNextPage}
              itemCount={virtualList.length}
              loadNextPage={loadNextPage}
              innerElementType={InnerElementType}
              size={ITEM_HEIGHT}
            />
          </ListContainer>
        </>
      )}
      <Divider size={32} />
    </>
  );
}
