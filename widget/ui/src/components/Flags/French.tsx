import type { FlagPropTypes } from './Flags.types';

import React from 'react';

import { DEFAULT_SIZE } from './Flags.constants';

export default function French(props: FlagPropTypes) {
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
        <path fill="#eee" d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" />
        <path fill="#0052b4" d="M0 0h167v512H0z" />
        <path fill="#d80027" d="M345 0h167v512H345z" />
      </g>
    </svg>
  );
}
