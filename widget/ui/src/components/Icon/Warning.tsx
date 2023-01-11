import * as React from 'react';
import { IconProps } from './types';

export const Warning = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M25.703 10.858a2 2 0 0 0-3.406 0L10.231 30.451l.851.525-.851-.525c-.82 1.333.138 3.049 1.703 3.049h24.132c1.565 0 2.524-1.716 1.703-3.049L25.703 10.858Z"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path
          d="M24 17a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1Zm0 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
          fill={color}
        />
      </svg>
    );
  }
);

export default Warning;
