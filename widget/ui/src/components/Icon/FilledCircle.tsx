import * as React from 'react';
import { styled } from '../../theme';
import { IconProps } from './types';
const Svg = styled('svg', {
  color: '$primary-500',
});

export const FilledCircle = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 8 8"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="4" cy="4" r="4" fill={color} />
      </Svg>
    );
  }
);

export default FilledCircle;
