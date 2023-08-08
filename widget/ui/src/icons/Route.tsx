import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgRoute(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 16" fill="none">
      <g id="Group 1000006510">
        <path
          id="Vector"
          d="M2.88356 8.34592C3.92383 8.34592 4.76713 7.50262 4.76713 6.46236C4.76713 5.4221 3.92383 4.5788 2.88356 4.5788C1.8433 4.5788 1 5.4221 1 6.46236C1 7.50262 1.8433 8.34592 2.88356 8.34592Z"
          stroke="currentColor"
          strokeWidth={1.1}
          strokeMiterlimit={10}
        />
        <path
          id="Vector_2"
          d="M15.786 11.9247C16.7742 11.9247 17.5754 11.1235 17.5754 10.1353C17.5754 9.14702 16.7742 8.34589 15.786 8.34589C14.7977 8.34589 13.9966 9.14702 13.9966 10.1353C13.9966 11.1235 14.7977 11.9247 15.786 11.9247Z"
          stroke="currentColor"
          strokeWidth={1.1}
          strokeMiterlimit={10}
        />
        <path
          id="Vector_3"
          d="M2.88379 8.34007V11.9917C2.88379 11.9917 2.88379 14.7569 6.21699 14.75C6.21699 14.75 9.08262 14.7569 9.30715 11.9917V3.86621C9.30715 3.86621 9.37196 1.31234 12.3973 1C12.3973 1 15.2791 1 15.5037 3.76056V8.34007"
          stroke="currentColor"
          strokeWidth={1.1}
          strokeMiterlimit={10}
        />
      </g>
    </svg>
  );
}
export default SvgRoute;
