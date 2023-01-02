import * as React from 'react';
import { IconProps } from './types';

export const Wallet = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.496 2h20a3 3 0 0 1 3 3v2.5h-7.375a3.75 3.75 0 1 0 0 7.5h7.375v2.5a3 3 0 0 1-3 3h-20a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm25 11.4v4.1a5 5 0 0 1-5 5h-20a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5V13.4Zm-2-4.3v4.3h-7.375a2.15 2.15 0 0 1 0-4.3h7.375Zm-6.906 3.556a1.406 1.406 0 1 0 0-2.812 1.406 1.406 0 0 0 0 2.812Z"
          fill={color}
        />
      </svg>
    );
  }
);

export default Wallet;
