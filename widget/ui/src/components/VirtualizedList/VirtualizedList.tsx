import React, { PropsWithChildren, useRef } from 'react';
import { ReactElementType, VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';

export type VirtualizedListItem = ({
  index,
  style,
}: {
  index: number;
  style: React.CSSProperties | undefined;
}) => JSX.Element | null;

type PropTypes = {
  itemCount: number;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadNextPage: () => void;
  Item: VirtualizedListItem;
  innerElementType: ReactElementType | undefined;
  size: number;
};

function VirtualizedList(props: PropsWithChildren<PropTypes>) {
  const {
    itemCount,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    Item,
    innerElementType,
    size,
  } = props;
  const listRef = useRef<any>(null);

  const isItemLoaded = (index: number) => !hasNextPage || index < itemCount;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={hasNextPage ? itemCount + 1 : itemCount}
      loadMoreItems={
        isNextPageLoading
          ? () => {
              // do nothing
            }
          : loadNextPage
      }
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
                    <Item index={index} style={style} />
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

export default VirtualizedList;
