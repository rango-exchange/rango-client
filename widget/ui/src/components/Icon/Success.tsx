import * as React from 'react';
import { IconProps } from './types';

export const Success = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.5 22c5.5 0 10-4.5 10-10S18 2 12.5 2s-10 4.5-10 10 4.5 10 10 10Z"
          fill="#0AA65B"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m8.25 12 2.83 2.83 5.67-5.66" fill="#0AA65B" />
        <path
          d="m8.25 12 2.83 2.83 5.67-5.66"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

export default Success;
