import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgTrash(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.375 7.84375L15.8942 14.9816C15.7727 16.6823 14.3575 18 12.6524 18H10.3476C8.64249 18 7.22731 16.6823 7.10583 14.9816L6.625 7.84375M5 8.25C5 8.25 7.16667 7.4375 11.5 7.4375C15.8333 7.4375 18 8.25 18 8.25M14.75 7.60577L14.6832 7.03678C14.4873 5.86144 13.4704 5 12.2789 5H10.7211C9.52958 5 8.51268 5.86144 8.31679 7.03678L8.25 7.60577M13.5312 11.5V13.9375M9.46875 11.5V13.9375M11.5 10.6875L11.5 14.75"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgTrash;
