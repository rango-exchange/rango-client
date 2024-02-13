import type { TypographyContainer } from './Typography.styles';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof TypographyContainer>;
type BaseSizes = Exclude<BaseProps['size'], object>;
type BaseVariants = Exclude<BaseProps['variant'], object>;
export type BaseAlign = Exclude<BaseProps['align'], object>;

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
type margin = 2 | 4 | 8 | 12;

export interface PropTypes {
  variant: BaseVariants;
  size: BaseSizes;
  align?: BaseAlign;
  noWrap?: boolean;
  // @depreacted It will be removed
  mt?: margin;
  // @depreacted It will be removed
  mb?: margin;
  // @depreacted It will be removed
  ml?: margin;
  // @depreacted It will be removed
  mr?: margin;
  className?: string;
  style?: Stitches.CSSProperties;
  color?: string;
}
