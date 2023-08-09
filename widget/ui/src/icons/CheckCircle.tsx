import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgCheckCircle(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none">
      <rect width={30} height={30} rx={15} fill="#BDECD7" />
      <path
        d="M15.0001 24.4C13.141 24.4 11.3236 23.8487 9.77774 22.8158C8.23192 21.7829 7.0271 20.3149 6.31563 18.5972C5.60417 16.8796 5.41802 14.9896 5.78072 13.1662C6.14342 11.3427 7.03868 9.66782 8.3533 8.35321C9.66791 7.03859 11.3428 6.14333 13.1663 5.78063C14.9897 5.41793 16.8797 5.60408 18.5973 6.31554C20.3149 7.02701 21.783 8.23183 22.8159 9.77765C23.8488 11.3235 24.4001 13.1409 24.4001 15C24.3973 17.4922 23.406 19.8815 21.6438 21.6437C19.8816 23.406 17.4923 24.3972 15.0001 24.4ZM9.71227 14.0182C9.53553 14.0178 9.36274 14.0705 9.21635 14.1696C9.06996 14.2686 8.95672 14.4093 8.89134 14.5735C8.82596 14.7377 8.81147 14.9178 8.84973 15.0904C8.888 15.2629 8.97726 15.42 9.10593 15.5411L12.9502 19.1703C13.119 19.3277 13.3429 19.4125 13.5736 19.4065C13.8043 19.4006 14.0235 19.3044 14.184 19.1386L20.9189 12.0882C21.0802 11.919 21.1677 11.6926 21.1621 11.4589C21.1564 11.2252 21.0582 11.0033 20.889 10.842C20.7198 10.6807 20.4934 10.5933 20.2597 10.5989C20.026 10.6045 19.8041 10.7028 19.6428 10.872L13.523 17.2826L10.3186 14.2579C10.155 14.1039 9.93875 14.0181 9.71403 14.0182H9.71227Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgCheckCircle;