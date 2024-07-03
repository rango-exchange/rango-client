import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgSwap(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_13896_357843)">
        <g clipPath="url(#clip1_13896_357843)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.46967 18.9837C0.176778 18.6908 0.176776 18.2159 0.469666 17.923L5.0163 13.3763C5.30919 13.0834 5.78406 13.0834 6.07696 13.3763C6.36985 13.6692 6.36986 14.1441 6.07697 14.437L2.06066 18.4534L6.07696 22.4697C6.36985 22.7626 6.36985 23.2374 6.07696 23.5303C5.78407 23.8232 5.30919 23.8232 5.0163 23.5303L0.46967 18.9837Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.25 18.4539C0.25 18.0396 0.585786 17.7039 1 17.7039H23C23.4142 17.7039 23.75 18.0396 23.75 18.4539C23.75 18.8681 23.4142 19.2039 23 19.2039H1C0.585786 19.2039 0.25 18.8681 0.25 18.4539Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.9228 10.6483C17.6299 10.3554 17.6299 9.88049 17.9228 9.58759L21.9391 5.57122L17.9228 1.55491C17.6299 1.26202 17.6299 0.787147 17.9228 0.494253C18.2157 0.201361 18.6906 0.201361 18.9835 0.494253L23.5301 5.04088C23.823 5.33378 23.823 5.80865 23.5301 6.10154L18.9835 10.6482C18.6906 10.9411 18.2157 10.9411 17.9228 10.6483Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.25 5.57129C0.25 5.15708 0.585786 4.82129 1 4.82129L23 4.82129C23.4142 4.82129 23.75 5.15708 23.75 5.57129C23.75 5.9855 23.4142 6.32129 23 6.32129L1 6.32129C0.585786 6.32129 0.25 5.9855 0.25 5.57129Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_13896_357843">
          <rect
            width={24}
            height={24}
            fill="white"
            transform="matrix(0 -1 1 0 0 24)"
          />
        </clipPath>
        <clipPath id="clip1_13896_357843">
          <rect
            width={24}
            height={24}
            fill="white"
            transform="matrix(0 -1 1 0 0 24)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgSwap;
