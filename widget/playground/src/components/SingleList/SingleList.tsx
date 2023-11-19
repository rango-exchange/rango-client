import type { PropTypes } from './SingleList.types';
import type { ForwardedRef } from 'react';
import type { CommonProps } from 'react-window';

import {
  CloseIcon,
  Divider,
  IconButton,
  Image,
  ListItemButton,
  NotFound,
  Radio,
  RadioRoot,
  SearchIcon,
  TextField,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { forwardRef, useEffect, useState } from 'react';

import {
  EmptyContainer,
  HeaderContainer,
  IconWrapper,
  RadioList,
  StyledButton,
} from './SingleList.styles';

const PAGE_SIZE = 30;
const ITEM_HEIGHT = 46;
const PADDING_SPACE = 8;

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
      <TextField
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        variant="contained"
        placeholder={searchPlaceholder}
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
        <RadioList>
          <RadioRoot
            value={item || defaultValue || undefined}
            style={{
              height: '100%',
            }}>
            <VirtualizedList
              Item={({ index, style }) => {
                const Icon = virtualList[index].Icon;
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
              hasNextPage={hasNextPage}
              itemCount={virtualList.length}
              loadNextPage={loadNextPage}
              innerElementType={InnerElementType}
              size={ITEM_HEIGHT}
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

export const InnerElementType: React.FC<CommonProps> = forwardRef(
  (render, ref) => {
    return (
      <div
        {...render}
        ref={ref as ForwardedRef<HTMLDivElement>}
        style={{
          ...render.style,
          height: `${
            parseFloat(render.style?.height as string) + PADDING_SPACE * 2
          }px`,
        }}
      />
    );
  }
);
InnerElementType.displayName = 'InnerElementType';
