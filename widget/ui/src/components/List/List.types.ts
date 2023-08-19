import type { ListItemProps } from '../ListItem';
import type * as Stitches from '@stitches/react';
import type React from 'react';

export interface ListPropTypes {
  type?: React.ReactElement;
  items: (ListItemProps & {
    id: string;
  })[];
  as?: 'div' | 'ul';
  css?: Stitches.CSS;
}
