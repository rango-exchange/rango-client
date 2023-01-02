import * as React from 'react';
import { IconProps } from './types';

export const SwapWallet = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.496 2h20a3 3 0 0 1 3 3v2.5h-7.375a3.75 3.75 0 1 0 0 7.5h7.375v2.5a3 3 0 0 1-3 3h-20a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm25 11.4v4.1a5 5 0 0 1-5 5h-20a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5V13.4Zm-2-4.3v4.3h-7.375a2.15 2.15 0 0 1 0-4.3h7.375Zm-6.906 3.556a1.406 1.406 0 1 0 0-2.812 1.406 1.406 0 0 0 0 2.812Z"
          fill={color}
        />
        <circle cx={8.496} cy={19} r={8} fill="#fff" />
        <path
          d="m11.343 15.002 2.152 3.074v.001h-1.633l-.001.001-.013 4.92-.001.002h-1.01l-.001-.001-.065-4.92-.001-.002H9.138c-.001 0-.002 0-.001-.001l2.204-3.074h.002ZM5.65 22.998l-2.153-3.074.001-.001H5.13l.001-.001L5.144 15 5.145 15h1.01l.002.001.064 4.92.001.002h1.633v.001l-2.204 3.074H5.65Z"
          fill="#5FA425"
          stroke="#5FA425"
          strokeWidth={0.7}
        />
      </svg>
    );
  }
);

export default SwapWallet;
