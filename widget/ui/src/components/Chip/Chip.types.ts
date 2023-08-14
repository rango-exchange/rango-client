import type { CSSProperties } from '@stitches/react';
import type { ReactNode } from 'react';

export interface PropTypes {
  label: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
  prefix?: ReactNode;
  suffix?: ReactNode;
}
