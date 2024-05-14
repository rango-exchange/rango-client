import type { SvgIconProps } from '../SvgIcon';
import type * as Stitches from '@stitches/react';

export interface SpinnerPropTypes {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  size?: 12 | 16 | 20 | 24 | 30;
  color?: SvgIconProps['color'];
  css?: Stitches.CSS;
}
