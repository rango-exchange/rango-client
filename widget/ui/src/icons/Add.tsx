import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgAdd(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        d="M18.8611 13.6389H4.63889C4.15296 13.6389 3.75 13.2359 3.75 12.75C3.75 12.2641 4.15296 11.8611 4.63889 11.8611H18.8611C19.347 11.8611 19.75 12.2641 19.75 12.75C19.75 13.2359 19.347 13.6389 18.8611 13.6389Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        d="M11.75 20.75C11.2641 20.75 10.8611 20.347 10.8611 19.8611V5.63889C10.8611 5.15296 11.2641 4.75 11.75 4.75C12.2359 4.75 12.6389 5.15296 12.6389 5.63889V19.8611C12.6389 20.347 12.2359 20.75 11.75 20.75Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgAdd;
