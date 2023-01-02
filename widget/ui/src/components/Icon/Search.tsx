import * as React from 'react';
import { IconProps } from './types';

export const Search = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.682 2.993A8.423 8.423 0 0 0 10 1.577 8.462 8.462 0 0 0 1.585 10a8.423 8.423 0 1 0 13.097-7.007ZM4.444 1.685a10 10 0 1 1 11.112 16.63A10 10 0 0 1 4.444 1.685Zm13.804 15.213 5.534 5.482a.739.739 0 0 1 .218.523.728.728 0 0 1-.221.522.753.753 0 0 1-.532.215.76.76 0 0 1-.531-.219l-5.534-5.482 1.066-1.041Z"
          fill={color}
        />
      </svg>
    );
  }
);

export default Search;
