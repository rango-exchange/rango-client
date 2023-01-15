import * as React from 'react';
import { IconProps } from './types';
import { styled } from '../../theme';
const Svg = styled('svg', {
  color: '$text',
});

export const Add = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M6 12h12M12 18V6"
          stroke="#10150F"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
);

export default Add;
