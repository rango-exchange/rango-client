import type { SkeletonContainer } from './Skeleton.styles.js';
import type { VariantProps } from '@stitches/react';

type BaseProps = VariantProps<typeof SkeletonContainer>;
type BaseVariants = Exclude<BaseProps['variant'], object>;
type BaseSizes = Exclude<BaseProps['size'], object>;

type TextVariant = {
  variant: 'text';
  size: BaseSizes;
  width?: number;
};

type OtherVariant = {
  variant: Exclude<BaseVariants, 'text'>;
  width?: number;
  height: number;
};

export type SkeletonPropTypes = TextVariant | OtherVariant;
