import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const DisconnectIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        ref={forwardedRef}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </SvgWithStrokeColor>
    );
  }
);

DisconnectIcon.toString = () => '._icon';
