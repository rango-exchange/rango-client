import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgBridges(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.21 9.21C15.93 10.78 13.45 13.3 13 17H15V19H9V17H11C10.5 12.5 6.63 9 2 9V7C6.39 7 10.22 9.55 12 13.3C13.13 10.87 14.99 9.05 16.78 7.78L14 5H21V12L18.21 9.21Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgBridges;
