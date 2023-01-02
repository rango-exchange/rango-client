import * as React from 'react';
import { IconProps } from './types';

export const Download = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size=50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.533 17.173 6.866 12.58a.667.667 0 0 1 .934-.953l3.533 3.473V2.667a.667.667 0 0 1 1.333 0V15.1l3.534-3.473a.667.667 0 1 1 .933.953l-4.666 4.593a.667.667 0 0 1-.934 0ZM17.7 5.333h2.913A1.333 1.333 0 0 1 22 6.666V20a1.334 1.334 0 0 1-1.387 1.333H3.387A1.333 1.333 0 0 1 2 20V6.666a1.333 1.333 0 0 1 1.387-1.333h2.866a.667.667 0 0 1 0 1.333h-2.92V20h17.334V6.666H17.7a.667.667 0 1 1 0-1.333Z"
          fill={color}
        />
      </svg>
    );
  }
);

export default Download;
