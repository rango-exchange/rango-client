import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const TryAgainIcon: React.FC<IconProps> = ({
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
        d="M22 12c0 5.52-4.48 10-10 10s-8.89-5.56-8.89-5.56m0 0h4.52m-4.52 0v5M2 12C2 6.48 6.44 2 12 2c6.67 0 10 5.56 10 5.56m0 0v-5m0 5h-4.44"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

TryAgainIcon.toString = () => '._icon';
