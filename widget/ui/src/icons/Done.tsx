import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgDone(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.7846 4.31584C24.1751 4.70637 24.1751 5.33953 23.7846 5.73006L10.0607 19.4539C9.1495 20.3651 7.67211 20.3651 6.76089 19.4539L1.03703 13.7301C0.64651 13.3395 0.64651 12.7064 1.03703 12.3158C1.42756 11.9253 2.06072 11.9253 2.45125 12.3158L8.17511 18.0397C8.30528 18.1699 8.51634 18.1699 8.64651 18.0397L22.3704 4.31584C22.7609 3.92532 23.3941 3.92532 23.7846 4.31584Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgDone;
