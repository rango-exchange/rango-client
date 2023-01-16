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
export const AngleLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
          
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
);

export default AngleLeft;
