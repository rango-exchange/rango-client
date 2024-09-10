import type { TypographyContainer } from './Typography.styles.js';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof TypographyContainer>;
type BaseSizes = Exclude<BaseProps['size'], object>;
type BaseVariants = Exclude<BaseProps['variant'], object>;
export type BaseAlign = Exclude<BaseProps['align'], object>;

export interface TypographyPropTypes {
  variant: BaseVariants;
  size: BaseSizes;
  align?: BaseAlign;
  noWrap?: boolean;
  className?: string;
  style?: Stitches.CSSProperties;
  color?: string;
}
