import * as React from 'react';
import { IconProps } from './types';
import { SvgWithFillColor } from './common';

export const CheckCircleIcon: React.FC<IconProps> = ({
  size = 16,
  color,
  ...props
}) => {
  return (
    <SvgWithFillColor
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={color}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#fff"
      />
      <path
        d="m7.75 12 2.83 2.83 5.67-5.66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#fff"
      />
    </SvgWithFillColor>
  );
};

CheckCircleIcon.toString = () => '._icon';
