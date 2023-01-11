import * as React from 'react';
import { IconProps } from './types';

export const Running = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
      >
        <path
          d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12Z"
          fill="#fff"
        />
        <path
          d="M19.834 12c0 4.6-3.734 8.333-8.334 8.333S4.092 15.7 4.092 15.7m0 0h3.767m-3.767 0v4.167M3.167 12c0-4.6 3.7-8.333 8.333-8.333 5.559 0 8.334 4.633 8.334 4.633m0 0V4.133m0 4.167h-3.7"
          stroke="#838383"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

export default Running;
