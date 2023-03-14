import React, { PropsWithChildren, useRef } from 'react';
import { ReactElementType, VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { CSSProperties } from '@stitches/react';

export type VirtualizedListItem = ({
  index,
  style,
}: {
  index: number;
  style: CSSProperties | undefined;
}) => JSX.Element | null;

type PropTypes = {
  itemCount: number;
  hasNextPage: boolean;
  loadNextPage: () => void;
  Item: VirtualizedListItem;
  innerElementType: ReactElementType | undefined;
  size: number;
};

export function VirtualizedList(props: PropsWithChildren<PropTypes>) {
  const { itemCount, hasNextPage, loadNextPage, Item, innerElementType, size } =
    props;
  const listRef = useRef<any>(null);

  const isItemLoaded = (index: number) => !hasNextPage || index < itemCount;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={hasNextPage ? itemCount + 1 : itemCount}
      loadMoreItems={loadNextPage}
      threshold={1}
    >
      {({ onItemsRendered }) => {
        return (
          <AutoSizer>
            {({ width, height }) => (
              <List
                innerElementType={innerElementType}
                ref={listRef}
                itemSize={() => size}
                itemCount={itemCount}
                height={height}
                width={width}
                onItemsRendered={onItemsRendered}
              >
                {({ index, style }) =>
                  isItemLoaded(index) ? (
                    <Item index={index} style={style as CSSProperties} />
                  ) : null
                }
              </List>
            )}
          </AutoSizer>
        );
      }}
    </InfiniteLoader>
  );
}
