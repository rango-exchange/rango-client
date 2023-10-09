import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgChevronLeft(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9597 0.540478C18.2136 0.794319 18.2136 1.20588 17.9597 1.45972L7.41934 12.0001L17.9597 22.5405C18.2136 22.7943 18.2136 23.2059 17.9597 23.4597C17.7059 23.7136 17.2943 23.7136 17.0405 23.4597L6.04048 12.4597C5.78664 12.2059 5.78664 11.7943 6.04048 11.5405L17.0405 0.540478C17.2943 0.286637 17.7059 0.286637 17.9597 0.540478Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgChevronLeft;
