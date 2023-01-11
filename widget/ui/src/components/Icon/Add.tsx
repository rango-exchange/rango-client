import * as React from 'react';
import { IconProps } from './types';

export const AddCircle = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 50, ...props }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM8 12h8M12 16V8"
          stroke="#000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

export default AddCircle;
