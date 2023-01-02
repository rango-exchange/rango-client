import * as React from 'react';
import { IconProps } from './types';

export const DarkWallet = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        viewBox="0 0 40 40"
        ref={forwardedRef}
      >
        <circle cx={18.496} cy={18} r={18} fill={color} />
        <path
          d="M26.733 9H11.765a2.516 2.516 0 0 0-2.516 2.516v10.941a2.516 2.516 0 0 0 2.516 2.517h14.968a2.516 2.516 0 0 0 2.516-2.517v-10.94A2.516 2.516 0 0 0 26.733 9Zm1.51 9.995H21.78a2.013 2.013 0 1 1 0-4.026h6.462v4.026Zm-6.462-5.033a3.02 3.02 0 1 0 0 6.04h6.462v2.456a1.51 1.51 0 0 1-1.51 1.51H11.765a1.51 1.51 0 0 1-1.51-1.51V11.515a1.51 1.51 0 0 1 1.51-1.51h14.968a1.51 1.51 0 0 1 1.51 1.51v2.446H21.78Z"
          fill="#fff"
        />
        <path
          d="M21.785 17.99a1.007 1.007 0 1 0 0-2.014 1.007 1.007 0 0 0 0 2.013Z"
          fill="#fff"
        />
        <circle cx={11.496} cy={23} r={6} fill={color} />
        <path
          d="m13.773 20.421 1.722 2.01-.001.002h-1.305l-.001.001-.01 3.218-.002.001h-.808l-.052-3.219-.001-.001H12.01c-.001 0-.002-.001-.001-.002l1.763-2.01h.001ZM9.219 25.652l-1.721-2.01v-.002H8.804l.01-3.219.002-.001h.808l.052 3.22H10.982c.001 0 .002.001.001.002l-1.763 2.01H9.22Z"
          fill="#00A9BB"
          stroke="#00A9BB"
          strokeWidth={0.7}
        />
      </svg>
    );
  }
);

export default DarkWallet;
