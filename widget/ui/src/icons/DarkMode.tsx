import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgDarkMode(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.37258 9.78494C9.37258 7.99775 10.1423 6.33088 11.4437 5.17318C11.7175 4.92967 11.5567 4.44003 11.1963 4.50607C7.66917 5.15238 4.97201 8.27321 5.00022 12.0067C5.03199 16.1273 8.40939 19.4968 12.5607 19.5C15.3021 19.502 17.82 17.9874 19.1426 15.6485C19.3229 15.3297 18.918 15.0255 18.6027 15.2119C14.6912 17.5249 9.37258 15.3579 9.37258 9.78494Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgDarkMode;
