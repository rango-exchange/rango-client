import type { TokensListProps, TokenType } from './TokensPanel.types';

import {
  Checkbox,
  Divider,
  IconButton,
  Image,
  ListItemButton,
  NotFound,
  PinIcon,
  Switch,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import {
  SelectButton,
  SelectDeselectText,
} from '../MultiList/MultiList.styles';
import { SearchInput } from '../SearchInput';
import { EmptyContainer } from '../SingleList/SingleList.styles';

import { ListContainer, TokensHeaderList } from './TokensPanel.styles';

const PAGE_SIZE = 20;
export function TokensList(props: TokensListProps) {
  const {
    list,
    onChange,
    onChangeAll,
    showSelectedTokens,
    setShowSelectedTokens,
    isAllSelected,
    isExcluded,
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
    onChange(token, 'checked');
  };

  // Toggle displaying selected tokens
  const toggleShowSelectedTokens = () => {
    setShowSelectedTokens(!showSelectedTokens);
  };

  const resultsNotFound = !virtualList.length && !!searchValue;

  //Change the list of pinned tokens
  const togglePinToken = (token: TokenType) => {
    onChange(token, 'pinned');
  };

  return (
    <>
      <SearchInput
        value={searchValue}
        placeholder="Search Tokens"
        setValue={(value) => setSearchValue(value)}
      />

      <Divider size={10} />
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
                disabled={false}
                color="neutral700">
                {isAllSelected ? 'Deselect all' : 'Select all'}
              </SelectDeselectText>
            </SelectButton>
            <div className="select_tokens">
              <Typography size="medium" variant="label" color="neutral700">
                {isExcluded ? 'Excluded' : 'Included'} Tokens
              </Typography>
              <Divider direction="horizontal" size={4} />
              <Switch
                checked={showSelectedTokens}
                onChange={toggleShowSelectedTokens}
              />
            </div>
          </TokensHeaderList>
          <Divider size={10} />
          <ListContainer>
            <VirtualizedList
              endReached={hasNextPage ? loadNextPage : undefined}
              itemContent={(index) => {
                return (
                  <div
                    style={{
                      paddingRight: 5,
                    }}>
                    <ListItemButton
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
                      end={
                        <>
                          {((virtualList[index].checked && !isExcluded) ||
                            (!virtualList[index].checked && isExcluded)) && (
                            <>
                              <IconButton
                                style={{ padding: 0 }}
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinToken(virtualList[index]);
                                }}>
                                <PinIcon
                                  color={
                                    virtualList[index].pinned
                                      ? 'secondary'
                                      : 'gray'
                                  }
                                  size={16}
                                />
                              </IconButton>
                              <Divider direction="horizontal" size={12} />
                            </>
                          )}
                          <Checkbox checked={virtualList[index].checked} />
                        </>
                      }
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
              totalCount={virtualList.length}
            />
          </ListContainer>
        </>
      )}
      <Divider size={32} />
    </>
  );
}
