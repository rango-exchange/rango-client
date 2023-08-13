import * as React from 'react';
import { IconProps } from './types';
import { SvgWithStrokeColor } from './common';
import { AngleDownIcon } from './AngleDownIcon';

export const AngleLeftIcon: React.FC<IconProps> = ({
  size = 16,
  color,
  ...props
}) => {
  return (
    <SvgWithStrokeColor
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      color={color}
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M15 19.92 8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

AngleDownIcon.toString = () => '._icon';
