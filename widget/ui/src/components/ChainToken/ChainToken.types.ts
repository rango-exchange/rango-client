import type { ChainImageContainer } from './ChainToken.styles.js';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof ChainImageContainer>;
type BaseSizes = Exclude<BaseProps['size'], object>;

export type ChainTokenPropTypes = {
  tokenImage?: string;
  chainImage?: string;
  chianImageId?: string;
  size: NonNullable<BaseSizes>;
  useAsPlaceholder?: boolean;
  loading?: boolean;
};
