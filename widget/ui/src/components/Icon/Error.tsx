import * as React from 'react';
import { IconProps } from './types';

export const Error = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        {...props}
        ref={forwardedRef}
      >
        <circle cx={8} cy={8} r={8} fill={color} />
        <path
          d="M7.833 3a.833.833 0 0 1 .834.833v5a.833.833 0 1 1-1.667 0v-5A.833.833 0 0 1 7.833 3Zm0 8.333a.833.833 0 1 0 0 1.667.833.833 0 0 0 0-1.667Z"
          fill="#fff"
        />
      </svg>
    );
  }
);

export default Error;
