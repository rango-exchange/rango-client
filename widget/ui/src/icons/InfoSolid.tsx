import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgInfoSolid(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none">
      <rect width={30} height={30} rx={15} fill="#E1D3FF" />
      <path
        d="M15.0001 24.4C13.141 24.4 11.3236 23.8487 9.77774 22.8159C8.23192 21.783 7.0271 20.3149 6.31563 18.5973C5.60417 16.8796 5.41802 14.9896 5.78072 13.1662C6.14342 11.3428 7.03868 9.66785 8.3533 8.35324C9.66791 7.03862 11.3428 6.14336 13.1663 5.78066C14.9897 5.41796 16.8797 5.60411 18.5973 6.31557C20.3149 7.02704 21.783 8.23186 22.8159 9.77768C23.8488 11.3235 24.4001 13.1409 24.4001 15C24.3973 17.4922 23.406 19.8815 21.6438 21.6438C19.8816 23.406 17.4923 24.3972 15.0001 24.4ZM13.3662 12.1834V13.2039L14.674 13.4296V19.6375L13.3662 19.8631V20.8748H17.5665V19.8631L16.2586 19.6375V12.1834H13.3662ZM14.674 8.34266V9.95721H16.2604V8.34266H14.674Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgInfoSolid;
