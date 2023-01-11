import * as React from 'react';
import { IconProps } from './types';

export const AngleLeft = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...props}
      >
        <path
          d="M19.92 15.05 13.4 8.53c-.77-.77-2.03-.77-2.8 0l-6.52 6.52"
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
