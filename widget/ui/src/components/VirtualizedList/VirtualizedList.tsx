import type { CSSProperties } from '@stitches/react';
import type { PropsWithChildren } from 'react';
import type { ReactElementType } from 'react-window';

import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

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
  // TODO:  react/prop-types problem
  // eslint-disable-next-line react/prop-types
  const { itemCount, hasNextPage, loadNextPage, Item, innerElementType, size } =
    props;

  const isItemLoaded = (index: number) => !hasNextPage || index < itemCount;

  return (
    <AutoSizer>
      {({ width, height }: { width: number; height: number }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={hasNextPage ? itemCount + 1 : itemCount}
          loadMoreItems={loadNextPage}
          threshold={1}>
          {({ onItemsRendered, ref }) => {
            return (
              <List
                innerElementType={innerElementType}
                ref={ref}
                itemSize={() => size}
                itemCount={itemCount}
                height={height || 0}
                width={width || 0}
                onItemsRendered={onItemsRendered}>
                {({ index, style }) =>
                  isItemLoaded(index) ? (
                    <Item index={index} style={style as CSSProperties} />
                  ) : null
                }
              </List>
            );
          }}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}
