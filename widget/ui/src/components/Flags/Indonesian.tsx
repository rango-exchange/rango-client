import type { FlagPropTypes } from './Flags.types.js';

import React from 'react';

import { DEFAULT_SIZE } from './Flags.constants.js';

export default function Indonesian(props: FlagPropTypes) {
  const { size = DEFAULT_SIZE } = props;

  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512">
      <mask id="a">
        <circle cx={256} cy={256} r={256} fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path fill="#eee" d="m0 256 249.6-41.3L512 256v256H0z" />
        <path fill="#a2001d" d="M0 0h512v256H0z" />
      </g>
    </svg>
  );
}
