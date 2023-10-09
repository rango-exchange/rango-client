import type { ListItemProps } from '../ListItem';
import type { CSSProperties } from '@stitches/react';

export type ListItemButtonProps = Omit<ListItemProps, 'onClick'> & {
  id: string;
  onClick: (id: string) => void;
  style?: CSSProperties;
  hasDivider?: boolean;
  selected?: boolean;
};
