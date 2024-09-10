import type { ListItemPropTypes } from '../ListItem/index.js';
import type { CSSProperties } from '@stitches/react';

export type ListItemButtonProps = Omit<ListItemPropTypes, 'onClick'> & {
  id: string;
  onClick: (id: string) => void;
  style?: CSSProperties;
  selected?: boolean;
};
