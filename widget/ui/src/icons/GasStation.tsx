import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgGasStation(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.4165 18.3332V4.1665C3.4165 2.49984 4.53317 1.6665 5.9165 1.6665H12.5832C13.9665 1.6665 15.0832 2.49984 15.0832 4.1665V18.3332H3.4165Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.1665 18.3335H16.3332"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.4915 8.3332H11.0165C11.8832 8.3332 12.5915 7.91653 12.5915 6.7582V5.7332C12.5915 4.57487 11.8832 4.1582 11.0165 4.1582H7.4915C6.62484 4.1582 5.9165 4.57487 5.9165 5.7332V6.7582C5.9165 7.91653 6.62484 8.3332 7.4915 8.3332Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.9165 10.8335H8.4165"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0835 13.3417L18.8335 13.3333V8.33333L17.1668 7.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgGasStation;
