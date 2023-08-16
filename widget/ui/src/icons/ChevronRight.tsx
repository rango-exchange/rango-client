import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgChevronRight(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.04028 0.540478C5.78644 0.794319 5.78644 1.20588 6.04028 1.45972L16.5807 12.0001L6.04028 22.5405C5.78644 22.7943 5.78644 23.2059 6.04028 23.4597C6.29412 23.7136 6.70568 23.7136 6.95952 23.4597L17.9595 12.4597C18.2134 12.2059 18.2134 11.7943 17.9595 11.5405L6.95952 0.540478C6.70568 0.286637 6.29412 0.286637 6.04028 0.540478Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgChevronRight;
