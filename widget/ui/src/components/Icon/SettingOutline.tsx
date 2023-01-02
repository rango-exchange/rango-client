import * as React from 'react';
import { IconProps } from './types';

export const SettingOutline = React.forwardRef<SVGSVGElement, IconProps>(
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
        <circle cx={24.496} cy={24} r={18} fill={color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.396 30.7V20.5h16.2v2.878a5.998 5.998 0 0 1 1.9 1.15V20.1a1.5 1.5 0 0 0-1.5-1.5h-17a1.5 1.5 0 0 0-1.5 1.5v11a1.5 1.5 0 0 0 1.5 1.5h9.7a5.98 5.98 0 0 1-.956-1.9h-8.344Z"
          fill="#fff"
        />
        <path
          d="M21.746 17c0-.69.56-1.25 1.25-1.25h3c.69 0 1.25.56 1.25 1.25v2.25h-5.5V17Z"
          stroke="#fff"
          strokeWidth={1.5}
        />
        <path
          d="M28.497 26.91 30.725 25l.002.001v1.448l3.568.012h.001v.897l-3.568.058h-.001v1.447c0 .001-.001.002-.002.001l-2.228-1.954v-.001ZM34.295 31.957l-2.228 1.908h-.002v-1.448l-3.568-.012h-.001v-.897l3.568-.058.001-.001v-1.447h.002l2.228 1.954v.001Z"
          fill="#0AA65B"
          stroke="#0AA65B"
          strokeWidth={0.7}
        />
      </svg>
    );
  }
);

export default SettingOutline;
