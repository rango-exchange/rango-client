import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgConnect(props: Omit<SvgIconPropsWithChildren, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.46575 10.6164C4.82755 10.6164 5.93151 9.51249 5.93151 8.15069C5.93151 6.78889 4.82755 5.68494 3.46575 5.68494C2.10396 5.68494 1 6.78889 1 8.15069C1 9.51249 2.10396 10.6164 3.46575 10.6164Z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeMiterlimit={10}
      />
      <path
        d="M20.3571 15.3013C21.6508 15.3013 22.6996 14.2526 22.6996 12.9589C22.6996 11.6652 21.6508 10.6164 20.3571 10.6164C19.0634 10.6164 18.0146 11.6652 18.0146 12.9589C18.0146 14.2526 19.0634 15.3013 20.3571 15.3013Z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeMiterlimit={10}
      />
      <path
        d="M3.46582 10.6088V15.3892C3.46582 15.3892 3.46582 19.009 7.82928 19C7.82928 19 11.5806 19.009 11.8746 15.3892V4.75213C11.8746 4.75213 11.9594 1.40889 15.9199 1C15.9199 1 19.6924 1 19.9864 4.61383V10.6088"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeMiterlimit={10}
      />
    </svg>
  );
}
export default SvgConnect;
