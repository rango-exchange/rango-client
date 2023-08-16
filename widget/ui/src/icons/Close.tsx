import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgClose(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3736_40175)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.4597 0.540356C23.7135 0.794197 23.7135 1.20575 23.4597 1.45959L12.9193 12L23.4597 22.5404C23.7135 22.7942 23.7135 23.2058 23.4597 23.4596C23.2059 23.7134 22.7943 23.7134 22.5405 23.4596L12.0001 12.9192L1.45972 23.4596C1.20588 23.7134 0.794319 23.7134 0.540478 23.4596C0.286637 23.2057 0.286637 22.7942 0.540478 22.5403L11.0808 12L0.54048 1.45961C0.286639 1.20577 0.286639 0.794217 0.54048 0.540376C0.794321 0.286535 1.20588 0.286535 1.45972 0.540376L12.0001 11.0807L22.5405 0.540356C22.7943 0.286515 23.2059 0.286515 23.4597 0.540356Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_3736_40175">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgClose;
