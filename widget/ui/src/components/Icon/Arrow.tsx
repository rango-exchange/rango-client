import * as React from 'react';
import { IconProps } from './types';

export const Arrow = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M1.867 8a2.133 2.133 0 1 0 4.266 0 2.133 2.133 0 0 0-4.266 0ZM44 8l-4-2.31v4.62L44 8ZM5 8.4a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8Zm2 .8a.4.4 0 0 0 0-.8v.8Zm2-.8a.4.4 0 0 0 0 .8v-.8ZM4 8.4h1v-.8H4v.8Zm3 0h2v-.8H7v.8Zm4 0h2v-.8h-2v.8Zm4 0h2v-.8h-2v.8Zm4 0h2v-.8h-2v.8Zm4 0h2v-.8h-2v.8Zm4 0h2v-.8h-2v.8Zm4 0h2v-.8h-2v.8Zm4 0h2v-.8h-2v.8Zm4 0h2v-.8h-2v.8Z"
          fill="#000"
        />
      </svg>
    );
  }
);

export default Arrow;
