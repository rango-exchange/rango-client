import type { SkeletonContainer } from './Skeleton.styles';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof SkeletonContainer>;
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

export type PropTypes = TextVariant | OtherVariant;
