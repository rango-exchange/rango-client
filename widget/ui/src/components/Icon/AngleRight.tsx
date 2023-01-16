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
export const AngleRight = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 16, color='black', ...props }) => {
    return (
      <Svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
 color={color}

        {...props}
      >
        <path
          d="m8.91 19.92 6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"
          
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
);

export default AngleRight;
