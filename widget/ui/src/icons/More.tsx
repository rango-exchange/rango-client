import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgMore(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        d="M7.80078 12.5C7.80078 11.6716 7.12921 11 6.30078 11C5.47235 11 4.80078 11.6716 4.80078 12.5C4.80078 13.3284 5.47235 14 6.30078 14C7.12921 14 7.80078 13.3284 7.80078 12.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        d="M13.8008 12.5C13.8008 11.6716 13.1292 11 12.3008 11C11.4724 11 10.8008 11.6716 10.8008 12.5C10.8008 13.3284 11.4724 14 12.3008 14C13.1292 14 13.8008 13.3284 13.8008 12.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        d="M19.8008 12.5C19.8008 11.6716 19.1292 11 18.3008 11C17.4724 11 16.8008 11.6716 16.8008 12.5C16.8008 13.3284 17.4724 14 18.3008 14C19.1292 14 19.8008 13.3284 19.8008 12.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgMore;
