import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const RetryRightIcon: React.FC<IconProps> = ({
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
        d="M14.89 5.08c-.87-.26-1.83-.43-2.89-.43-4.79 0-8.67 3.88-8.67 8.67C3.33 18.12 7.21 22 12 22s8.67-3.88 8.67-8.67c0-1.78-.54-3.44-1.46-4.82M16.13 5.32 13.24 2M16.13 5.32l-3.37 2.46"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

RetryRightIcon.toString = () => '._icon';
