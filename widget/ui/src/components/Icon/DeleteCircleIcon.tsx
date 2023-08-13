import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const DeleteCircleIcon: React.FC<IconProps> = ({
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
        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

DeleteCircleIcon.toString = () => '._icon';
