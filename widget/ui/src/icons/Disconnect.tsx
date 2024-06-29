import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgDisconnect(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_18445_28182)">
        <path
          d="M8.13506 3.78534L8.13511 4.78364C8.13513 5.00352 8.01379 5.20546 7.81963 5.30868C4.92721 6.84636 3.08106 9.85427 3.08106 13.1893C3.08106 18.1151 7.07415 22.1082 11.9999 22.1082C16.9256 22.1082 20.9187 18.1151 20.9187 13.1893C20.9187 9.85438 19.0727 6.84656 16.1804 5.30883C15.9863 5.20561 15.8649 5.00367 15.865 4.78379L15.865 3.78548C15.865 3.3487 16.3202 3.06102 16.7148 3.24845C20.5215 5.05701 22.9998 8.89953 22.9998 13.1893C22.9998 19.2644 18.075 24.1892 11.9999 24.1892C5.92482 24.1892 1 19.2644 1 13.1893C1 8.8994 3.47838 5.05679 7.28533 3.2483C7.67985 3.06089 8.13503 3.34857 8.13506 3.78534ZM12.4458 -0.189453C12.7742 -0.189453 13.0404 0.0767532 13.0404 0.405135V11.405C13.0404 11.7334 12.7742 11.9996 12.4458 11.9996H11.5539C11.2256 11.9996 10.9594 11.7334 10.9594 11.405V0.405135C10.9594 0.0767532 11.2256 -0.189453 11.5539 -0.189453H12.4458Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_18445_28182">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgDisconnect;
