import * as React from 'react';
import { IconProps } from './types';

export const DarkSetting = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        {...props}
        ref={forwardedRef}
      >
        <g clipPath="url(#a)">
          <circle cx={24.496} cy={24} r={18} fill={color} />
          <path
            d="m30.496 34 6-10-6-10h-12l-6 10 6 10h12Z"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path
            d="M24.496 26.94a3.03 3.03 0 0 0 2.121-.861c.563-.552.88-1.3.88-2.08s-.317-1.528-.88-2.08a3.031 3.031 0 0 0-2.12-.861 3.03 3.03 0 0 0-2.122.861 2.912 2.912 0 0 0-.879 2.08c0 .78.316 1.528.879 2.08a3.03 3.03 0 0 0 2.121.861Z"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" transform="translate(.496)" d="M0 0h48v48H0z" />
          </clipPath>
        </defs>
      </svg>
    );
  }
);

export default DarkSetting;
