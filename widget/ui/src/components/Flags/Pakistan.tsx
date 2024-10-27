import type { FlagPropTypes } from './Flags.types.js';

import React from 'react';

import { DEFAULT_SIZE } from './Flags.constants.js';

export default function Pakistan(props: FlagPropTypes) {
  const { size = DEFAULT_SIZE } = props;

  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512">
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path fill="#eee" d="M0 0h133.6l50.2 252.5L133.6 512H0z" />
        <path fill="#496e2d" d="M133.6 0H512v512H133.6z" />
        <path
          fill="#eee"
          d="M365.5 298.3A72.3 72.3 0 1 1 313.7 168a89 89 0 1 0 74.6 103.2 72 72 0 0 1-22.8 27.2zM364 167l18.2 19.6 24.3-11.3-13 23.5 18.2 19.6-26.3-5.1-13 23.4-3.3-26.7-26.1-5 24.4-11.3z"
        />
      </g>
    </svg>
  );
}