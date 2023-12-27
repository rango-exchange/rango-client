import type { ButtonBase } from './Button.styles';
import type * as Stitches from '@stitches/react';
import type { HTMLAttributes } from 'react';

type BaseProps = Stitches.VariantProps<typeof ButtonBase>;
type BaseSizes = Exclude<BaseProps['size'], object>;
type BaseVariants = Exclude<BaseProps['variant'], object>;
type BaseTypes = Exclude<BaseProps['type'], object>;

export type Ref =
  | ((instance: HTMLButtonElement | null) => void)
  | React.RefObject<HTMLButtonElement>
  | null
  | undefined;

type ButtonElement = Omit<HTMLAttributes<HTMLButtonElement>, 'prefix'>;

export type PropTypes = ButtonElement & {
  size?: BaseSizes;
  variant?: BaseVariants;
  type?: BaseTypes;
  loading?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
  disableRipple?: boolean;
};
