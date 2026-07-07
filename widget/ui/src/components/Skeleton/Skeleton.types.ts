import type { SkeletonContainer } from './Skeleton.styles.js';
import type { VariantProps } from '@stitches/react';

type BaseProps = VariantProps<typeof SkeletonContainer>;
type BaseVariants = Exclude<BaseProps['variant'], object>;
type BaseSizes = Exclude<BaseProps['size'], object>;

type TextVariant = {
  variant: 'text';
  size: BaseSizes;
  width?: string | number;
};

type OtherVariant = {
  variant: Exclude<BaseVariants, 'text'>;
  width?: string | number;
  height: string | number;
};

export type SkeletonPropTypes = TextVariant | OtherVariant;
