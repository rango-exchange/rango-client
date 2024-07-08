import type { InputContainer } from './TextField.styles';
import type { TypographyPropTypes } from '../Typography';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof InputContainer>;
type BaseSizes = Exclude<BaseProps['size'], object>;
type BaseVariants = Exclude<BaseProps['variant'], object>;

export type Ref =
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export type TextFieldPropTypes = {
  label?: string | React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: BaseSizes;
  variant?: BaseVariants;
  fullWidth?: boolean;
  labelProps?: TypographyPropTypes;
  style?: Stitches.CSS;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'>;
