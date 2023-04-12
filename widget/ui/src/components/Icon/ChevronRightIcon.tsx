import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const ChevronRightIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="_icon"
        {...props}
        ref={forwardedRef}
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </SvgWithStrokeColor>
    );
  }
);

ChevronRightIcon.toString = () => '._icon';
