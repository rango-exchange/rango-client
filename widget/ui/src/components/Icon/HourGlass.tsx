import * as React from 'react';
import { IconProps } from './types';

export const HourGlass = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size = 50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m16.578 28 8.256-5.418a1 1 0 0 0 .452-.836V13a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v8.746a1 1 0 0 0 .451.836L15.707 28l-8.256 5.418a1 1 0 0 0-.451.836V43a1 1 0 0 0 1 1h16.286a1 1 0 0 0 1-1v-8.746a1 1 0 0 0-.452-.836L16.578 28Zm-.435-2.107L9 21.206V14h14.286v7.206l-7.143 4.688Zm0 4.213 7.143 4.688V42H9v-7.206l7.143-4.687Z"
          fill={color}
        />
        <path
          d="M17.047 24.4a2 2 0 0 1-1.808 0l-2.571-1.303a2 2 0 0 1-1.096-1.785v-.74a2 2 0 0 1 2-2h5.142a2 2 0 0 1 2 2v.74a2 2 0 0 1-1.096 1.785l-2.571 1.302Z"
          fill={color}
        />
      </svg>
    );
  }
);

export default HourGlass;
