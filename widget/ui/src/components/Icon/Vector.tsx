import * as React from 'react';
import { IconProps } from './types';

export const Vector = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M6.333 6.333V1.8a.8.8 0 0 1 .8-.8h11.734a.8.8 0 0 1 .8.8v4.533M10.333 1v5.333M13 1v5.333m9.333 17.334H3.667A2.667 2.667 0 0 1 1 21V9a2.667 2.667 0 0 1 2.667-2.667h18.666A2.667 2.667 0 0 1 25 9v12a2.667 2.667 0 0 1-2.667 2.667Z"
          stroke={color}
          strokeWidth={1.5}
        />
      </svg>
    );
  }
);

export default Vector;
