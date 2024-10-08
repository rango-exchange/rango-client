import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgTelegram(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        d="M27.5468 4.97762C27.1374 4.61721 26.4944 4.56565 25.8295 4.84275H25.8285C25.1292 5.13402 6.03537 13.6363 5.25808 13.9837C5.11671 14.0347 3.88199 14.5129 4.00918 15.5783C4.12271 16.5388 5.11507 16.9366 5.23625 16.9825L10.0905 18.708C10.4125 19.8209 11.5998 23.927 11.8623 24.8042C12.0261 25.351 12.293 26.0696 12.7608 26.2175C13.1713 26.3818 13.5796 26.2316 13.8438 26.0163L16.8116 23.1586L21.6025 27.0375L21.7166 27.1083C22.0419 27.2579 22.3536 27.3327 22.6511 27.3327C22.8809 27.3327 23.1014 27.2879 23.3121 27.1984C24.0299 26.8924 24.317 26.1823 24.347 26.1019L27.9256 6.79152C28.144 5.76019 27.8405 5.23545 27.5468 4.97762ZM14.3716 19.3982L12.734 23.9315L11.0965 18.2649L23.6511 8.63149L14.3716 19.3982Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgTelegram;
