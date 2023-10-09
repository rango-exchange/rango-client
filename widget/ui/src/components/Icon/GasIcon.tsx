/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { IconProps } from './types';

import * as React from 'react';

import { SvgWithStrokeColor } from './common';

export const GasIcon: React.FC<IconProps> = ({
  size = 16,
  color,
  ...props
}) => {
  return (
    <SvgWithStrokeColor
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={color}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M4 22V5c0-2 1.34-3 3-3h8c1.66 0 3 1 3 3v17H4ZM2.5 22h17"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.89 10h4.23c1.04 0 1.89-.5 1.89-1.89V6.88c0-1.39-.85-1.89-1.89-1.89H8.89C7.85 4.99 7 5.49 7 6.88v1.23C7 9.5 7.85 10 8.89 10ZM7 13h3M18 16.01l4.5-.01v-6l-2-1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

GasIcon.toString = () => '._icon';
