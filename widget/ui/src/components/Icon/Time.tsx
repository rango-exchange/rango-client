import * as React from 'react';
import { IconProps } from './types';

export const Time = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <circle cx={10} cy={10} r={7.25} stroke={'#000'} strokeWidth={1.5} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.134 6.6a.6.6 0 0 0-1.2 0v4.27a.6.6 0 0 0 .28.507c.009.01.018.019.029.028l2.59 2.373a.472.472 0 0 0 .753-.109.763.763 0 0 0-.133-.919l-2.319-2.123V6.6Z"
          fill={'#000'}
        />
      </svg>
    );
  }
);

export default Time;
