import type { DividerContainer } from './Divider.styles';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof DividerContainer>;
type BaseSizes = Exclude<BaseProps['size'], object>;

export interface PropTypes {
  size?: BaseSizes;
  direction?: 'vertical' | 'horizontal';
}
