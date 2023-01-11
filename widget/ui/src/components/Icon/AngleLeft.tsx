import * as React from 'react';
import { IconProps } from './types';

export const AngleLeft = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M15 19.92 8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
          stroke="#000"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

export default AngleLeft;
