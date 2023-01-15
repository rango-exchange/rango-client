import * as React from 'react';
import { IconProps } from './types';
import { styled } from '../../theme';
const Svg = styled('svg', {
  color: '$text',
});
export const Retry = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size=50, ...props }, forwardedRef) => {
    return (
      <Svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"

        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.016 13.45c.199-.384.002-.842-.397-1.005-.406-.166-.864.033-1.077.416A6.17 6.17 0 0 1 13 15.345a6.051 6.051 0 0 1-4.244.513 6.127 6.127 0 0 1-3.543-2.425 6.286 6.286 0 0 1 .73-8.095A6.089 6.089 0 0 1 9.86 3.604a6.07 6.07 0 0 1 4.083 1.286 6.196 6.196 0 0 1 1.65 1.97l-1.053.363a.302.302 0 0 0-.073.534l2.607 1.758a.3.3 0 0 0 .45-.155l1.01-3.007a.298.298 0 0 0-.38-.378l-1.057.365a7.79 7.79 0 0 0-2.194-2.713 7.627 7.627 0 0 0-5.13-1.615A7.65 7.65 0 0 0 4.852 4.19a7.898 7.898 0 0 0-.917 10.17 7.7 7.7 0 0 0 4.452 3.048 7.604 7.604 0 0 0 5.333-.644 7.757 7.757 0 0 0 3.297-3.315Z"
          fill={color}
        />
      </Svg>
    );
  }
);

export default Retry;