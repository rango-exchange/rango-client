import * as React from 'react';
import { IconProps } from './types';

export const SwapsHistory = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size=50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.496 11.9h14.6a6.1 6.1 0 0 1 6.1 6.1v5.241h1.9V18a8 8 0 0 0-8-8h-14.6a3 3 0 0 0-3 3v26a3 3 0 0 0 3 3h8.733v-1.9h-8.733a1.1 1.1 0 0 1-1.1-1.1V13a1.1 1.1 0 0 1 1.1-1.1Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.195 23.394a.95.95 0 0 0 1.9 0v-3.617a.95.95 0 1 0-1.9 0v3.617ZM19.178 40.098a.95.95 0 1 0 0 1.9h3.434a.95.95 0 1 0 0-1.9h-3.433ZM14.496 18.85c0-.47.38-.85.85-.85h14.3a.85.85 0 0 1 0 1.7h-14.3a.85.85 0 0 1-.85-.85Zm0 4.139c0-.47.38-.85.85-.85h12.3a.85.85 0 1 1 0 1.7h-12.3a.85.85 0 0 1-.85-.85Zm.85 3.287a.85.85 0 0 0 0 1.7h10.3a.85.85 0 0 0 0-1.7h-10.3Z"
          fill={color}
        />
        <path
          stroke={color}
          strokeWidth={1.3}
          strokeLinecap="round"
          d="M35.232 29.408v9.735"
        />
        <path
          d="m33.326 31.385 2.17-2.917 2.17 2.917h-4.34Z"
          fill={color}
          stroke={color}
          strokeWidth={1.3}
        />
        <path
          stroke={color}
          strokeWidth={1.3}
          strokeLinecap="round"
          d="M30.16 39.419v-9.735"
        />
        <path
          d="m32.066 37.443-2.17 2.916-2.17-2.916h4.34Z"
          fill={color}
          stroke={color}
          strokeWidth={1.3}
        />
      </svg>
    );
  }
);

export default SwapsHistory;
