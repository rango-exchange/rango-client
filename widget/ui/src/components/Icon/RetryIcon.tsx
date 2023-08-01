import * as React from 'react';
import { SvgWithFillColor } from './common';
import { IconProps } from './types';

export const RetryIcon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, forwardedRef) => {
    return (
      <SvgWithFillColor
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        className="_icon"
        {...props}
        ref={forwardedRef}>
        <path d="M8.00001 0C10.1499 0 12.1668 0.852996 13.6568 2.34319C13.9257 2.61193 14.1747 2.89898 14.402 3.20201L14.4 1.60002C14.4 1.18977 14.7089 0.851596 15.1067 0.805396L15.2 0.800039C15.6103 0.800039 15.9484 1.10887 15.9946 1.50672L16 1.60002V5.6C16 6.01026 15.6912 6.34843 15.2933 6.39463L15.2 6.39998H11.2C10.7582 6.39998 10.4 6.04184 10.4 5.59999C10.4 5.18973 10.7089 4.85156 11.1067 4.80536L11.2 4.80001L13.5441 4.80023C13.2644 4.31686 12.922 3.87101 12.5255 3.47458C11.3325 2.2815 9.72125 1.60005 8.00006 1.60005C4.4655 1.60005 1.60008 4.46546 1.60008 8.00001C1.60008 11.5346 4.4655 14.4 8.00006 14.4C9.72125 14.4 11.3326 13.7185 12.5255 12.5254C13.1199 11.9311 13.5929 11.2257 13.9148 10.4496C14.0748 10.0636 14.1967 9.66218 14.2781 9.24992C14.364 8.81644 14.7848 8.53464 15.2182 8.62035C15.6517 8.70607 15.9335 9.12692 15.8478 9.5604C15.7457 10.0766 15.5931 10.5793 15.3927 11.0624C14.9902 12.0332 14.3991 12.9146 13.6568 13.6568C12.1668 15.147 10.15 16 7.99997 16C3.5817 16 0 12.4183 0 8.00004C0 3.58178 3.5817 8.31996e-05 7.99997 8.31996e-05L8.00001 0Z" />
      </SvgWithFillColor>
    );
  }
);

RetryIcon.toString = () => '._icon';
