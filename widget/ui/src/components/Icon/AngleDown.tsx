import * as React from 'react';
import { IconProps } from './types';

export const AngleLeft = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
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
