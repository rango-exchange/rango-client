import React from 'react';
import { IconProps } from './types';
import { SvgWithStrokeColor } from './common';

export const AngleDownIcon: React.FC<IconProps> = ({
  size = 16,
  color,
  ...props
}) => (
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
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgWithStrokeColor>
);

AngleDownIcon.toString = () => '._icon';
