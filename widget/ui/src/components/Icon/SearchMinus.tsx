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
export const SearchMinus = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9 11.7h5M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"
          
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
);

export default SearchMinus;
