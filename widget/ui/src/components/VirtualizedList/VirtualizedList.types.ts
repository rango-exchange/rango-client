import type { CSSProperties } from '@stitches/react';
import type { ReactElementType } from 'react-window';

export type VirtualizedListItem = ({
  index,
  style,
}: {
  index: number;
  style: CSSProperties | undefined;
}) => JSX.Element | null;

export type PropTypes = {
  itemCount: number;
  hasNextPage: boolean;
  loadNextPage: () => void;
  Item: VirtualizedListItem;
  innerElementType: ReactElementType | undefined;
  size: number;
};
