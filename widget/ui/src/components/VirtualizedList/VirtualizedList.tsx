import React, { forwardRef, PropsWithChildren, useEffect, useRef } from 'react';
import {
  CommonProps,
  ReactElementType,
  VariableSizeList as List,
} from 'react-window';
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
  focus: number;
  innerElementType: ReactElementType | undefined;
};

function VirtualizedList(props: PropsWithChildren<PropTypes>) {
  const {
    itemCount,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    focus,
    Item,
    innerElementType,
  } = props;
  const listRef = useRef<any>(null);

  const isItemLoaded = (index: number) => !hasNextPage || index < itemCount;
  // eslint-disable-next-line react/display-name, react/prop-types
  // const innerElementType: React.FC<CommonProps> = forwardRef(
  //   ({ style, ...rest }, ref) => (
  //     <div
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       ref={ref as any}
  //       style={{
  //         ...style,
  //         // eslint-disable-next-line react/prop-types
  //         height: `${parseFloat(style?.height as string) + 8 * 2}px`,
  //       }}
  //       {...rest}
  //     />
  //   )
  // );
  const scrollTo = (num: number) =>
    listRef?.current?.scrollToItem(num, 'center');

  useEffect(() => {
    focus === 0 && scrollTo(focus);
  }, [focus]);

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
                itemSize={() => 72}
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
