import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const RetryIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'black', size = 16, ...props }, forwardedRef) => {
    return (
      <SvgWithStrokeColor
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        color={color}
        viewBox={`0 0 24 24`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="_icon"
        {...props}
        ref={forwardedRef}>
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
      </SvgWithStrokeColor>
    );
  }
);

RetryIcon.toString = () => '._icon';
