import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgBullhorn(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <g id="Frame 1000009392">
        <path
          id="Vector"
          d="M11.2837 4.18222L12.8874 12.333M6.09508 13.6694L12.8219 12.3459C13.0879 12.2935 13.3626 12.3075 13.6219 12.3865L17.3842 13.5325C18.0508 13.7356 18.6933 13.1551 18.5588 12.4714L16.48 1.90558C16.3454 1.22189 15.5309 0.928099 14.9909 1.36852L11.9432 3.85445C11.7332 4.02578 11.4842 4.14277 11.2182 4.1951L4.4914 5.51863C2.24063 5.96147 0.775013 8.14508 1.21786 10.3958C1.6607 12.6466 3.84431 14.1122 6.09508 13.6694ZM5.64226 13.7585L8.02441 17.9576C8.32196 18.4822 8.92177 18.7574 9.51347 18.641C10.4518 18.4564 10.9334 17.4068 10.4616 16.575L8.54031 13.1883L5.64226 13.7585Z"
          stroke="currentColor"
          fill="#00000000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
export default SvgBullhorn;
