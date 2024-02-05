import type { PropTypes } from './SingleList.types';

import {
  Divider,
  Image,
  ListItemButton,
  NotFound,
  Radio,
  RadioRoot,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { SearchInput } from '../SearchInput';

import {
  EmptyContainer,
  HeaderContainer,
  RadioList,
  StyledButton,
} from './SingleList.styles';

const PAGE_SIZE = 30;

export function SingleList(props: PropTypes) {
  const { list, onChange, defaultValue, title, icon, searchPlaceholder } =
    props;
  const [virtualList, setVirtualList] = useState(list);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [searchValue, setSearchValue] = useState('');
  const [item, setItem] = useState('');
  const filteredList = searchValue
    ? list.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : list;

  const handleConfirm = () => {
    onChange(item);
  };

  useEffect(() => {
    setHasNextPage(filteredList.length > virtualList.length);
  }, [virtualList.length]);
  useEffect(() => {
    setVirtualList(filteredList.slice(0, PAGE_SIZE));
  }, [list, searchValue]);

  const loadNextPage = () => {
    setVirtualList(list.slice(0, virtualList.length + PAGE_SIZE));
  };

  const resultsNotFound = !virtualList.length && !!searchValue;

  return (
    <>
      <HeaderContainer>
        <div className="header">
          {icon}
          <Divider direction="horizontal" size={4} />
          <Typography size="medium" variant="body">
            {title}
          </Typography>
        </div>
      </HeaderContainer>
      <Divider size={20} />
      <SearchInput
        value={searchValue}
        placeholder={searchPlaceholder}
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
        <RadioList>
          <RadioRoot
            value={item || defaultValue || undefined}
            style={{
              height: '100%',
            }}>
            <VirtualizedList
              endReached={hasNextPage ? loadNextPage : undefined}
              itemContent={(index) => {
                const Icon = virtualList[index].Icon;
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
                        ) : Icon ? (
                          <Icon size={16} />
                        ) : null
                      }
                      hasDivider
                      onClick={() => setItem(virtualList[index].value || '')}
                      end={<Radio value={virtualList[index].value || ''} />}
                      title={
                        <Typography variant="title" size="small">
                          {virtualList[index].name}
                        </Typography>
                      }
                      key={`${virtualList[index].name}${virtualList[index].value}`}
                      id={`${virtualList[index].name}${virtualList[index].value}`}
                    />
                  </div>
                );
              }}
              totalCount={virtualList.length}
            />
          </RadioRoot>
        </RadioList>
      )}
      <Divider size={32} />
      <Divider size={32} />
      {!resultsNotFound && (
        <StyledButton
          type="primary"
          size="medium"
          variant="contained"
          onClick={handleConfirm}>
          Confirm
        </StyledButton>
      )}
    </>
  );
}
