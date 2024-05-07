import type { ListItemPropTypes } from '../ListItem';
import type * as Stitches from '@stitches/react';
import type React from 'react';

export interface ListPropTypes {
  type?: React.ReactElement;
  items: (ListItemPropTypes & {
    id: string;
    type?: React.ReactElement;
  })[];
  as?: 'div' | 'ul';
  css?: Stitches.CSS;
}
