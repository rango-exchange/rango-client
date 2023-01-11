import * as React from 'react';
import { IconProps } from './types';

export const CircleCheck = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        ref={forwardedRef}
        {...props}
      >
        <circle cx={16} cy={16} r={8} fill="#fff" />
        <path
          d="M16 8c-4.416 0-8 3.584-8 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8Zm-2.168 11.432L10.96 16.56a.798.798 0 0 1 1.128-1.128l2.312 2.304 5.504-5.504a.798.798 0 0 1 1.128 1.128l-6.072 6.072a.795.795 0 0 1-1.128 0Z"
          fill={color}
        />
      </svg>
    );
  }
);

export default CircleCheck;
