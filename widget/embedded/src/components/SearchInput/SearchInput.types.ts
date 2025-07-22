import type { TextField } from '@arlert-dev/ui';
import type * as Stitches from '@stitches/react';
import type { ComponentProps, ReactElement } from 'react';

export type PropTypes = {
  variant?: 'contained' | 'outlined' | 'ghost';
  fullWidth?: boolean;
  color?: 'dark' | 'light';
  size?: 'small' | 'large';
  value: string;
  setValue?: (value: string) => void;
  style?: Stitches.CSS;
  suffix?: ReactElement;
} & ComponentProps<typeof TextField>;
