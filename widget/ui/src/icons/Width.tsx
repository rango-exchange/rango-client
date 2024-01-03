import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgWidth(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="Width" clipPath="url(#clip0_5933_20072)">
        <path
          id="Width_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.206748 12.0355C-0.0689161 11.8403 -0.0689161 11.5237 0.206748 11.3284L4.69896 8.14645C4.97462 7.95118 5.42156 7.95118 5.69722 8.14645C5.97289 8.34171 5.97289 8.65829 5.69722 8.85355L2.41003 11.182H21.59L18.3028 8.85355C18.0271 8.65829 18.0271 8.34171 18.3028 8.14645C18.5784 7.95118 19.0254 7.95118 19.301 8.14645L23.7933 11.3284C24.0689 11.5237 24.0689 11.8403 23.7933 12.0355L19.301 15.2175C19.0254 15.4128 18.5784 15.4128 18.3028 15.2175C18.0271 15.0223 18.0271 14.7057 18.3028 14.5104L21.59 12.182H2.41003L5.69722 14.5104C5.97289 14.7057 5.97289 15.0223 5.69722 15.2175C5.42156 15.4128 4.97462 15.4128 4.69896 15.2175L0.206748 12.0355Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_5933_20072">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgWidth;
