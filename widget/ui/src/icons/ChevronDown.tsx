import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgChevronDown(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.4595 6.04028C23.2057 5.78644 22.7941 5.78644 22.5403 6.04028L11.9999 16.5807L1.45952 6.04028C1.20568 5.78644 0.794123 5.78644 0.540283 6.04028C0.286442 6.29412 0.286442 6.70568 0.540283 6.95952L11.5403 17.9595C11.7941 18.2134 12.2057 18.2134 12.4595 17.9595L23.4595 6.95952C23.7134 6.70568 23.7134 6.29412 23.4595 6.04028Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgChevronDown;
