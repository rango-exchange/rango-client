import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const TrashIcon: React.FC<IconProps> = ({
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
        d="M21.5 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3l-2.04.2M9 4.97l.22-1.31C9.38 2.71 9.5 2 11.19 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M19.35 9.14l-.65 10.07c-.11 1.57-.2 2.79-2.99 2.79H9.29c-2.79 0-2.88-1.22-2.99-2.79L5.65 9.14M10.83 16.5h3.33M10 12.5h5"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

TrashIcon.toString = () => '._icon';
