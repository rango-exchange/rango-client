import type * as Stitches from '@stitches/react';

export interface PropTypes {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  title?: string | React.ReactNode;
  disableCurves?: boolean;
  titlePosition?: 'left' | 'center' | 'right';
  transparent?: boolean;
  css?: Stitches.CSS;
}
