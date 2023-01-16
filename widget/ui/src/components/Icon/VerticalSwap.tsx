import * as React from 'react';
import { IconProps } from './types';
import { styled } from '../../theme';
const Svg = styled('svg', {
   variants: {
    color: {
      primary: {
        stroke:'$primary'
      },
      error: {
        stroke:'$error'
      },
      warning: {
        stroke:'$warning'
      },
      success: {
        stroke:'$success'
      },
      black:{
        stroke:'$black'
      },
      white:{
        stroke:'$white'
      }
    },
  },


});
export const VerticalSwap = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 16, color='black', ...props }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
 color={color}

        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="m13.82 6.85 3.04 3.04M13.82 17.15V6.85M10.18 17.15l-3.04-3.04M10.18 6.85v10.3"
          
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
          
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
);

export default VerticalSwap;
