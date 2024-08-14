import type { FlagPropTypes } from './Flags.types.js';

import React from 'react';

import { DEFAULT_SIZE } from './Flags.constants.js';

export default function Hindi(props: FlagPropTypes) {
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
        <path fill="#eee" d="m0 160 256-32 256 32v192l-256 32L0 352z" />
        <path fill="#ff9811" d="M0 0h512v160H0Z" />
        <path fill="#6da544" d="M0 352h512v160H0Z" />
        <circle cx={256} cy={256} r={72} fill="#0052b4" />
        <circle cx={256} cy={256} r={48} fill="#eee" />
        <circle cx={256} cy={256} r={24} fill="#0052b4" />
      </g>
    </svg>
  );
}
