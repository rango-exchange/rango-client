import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgDarkMode(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.2108 17.0072C23.0403 16.7482 22.6992 16.5755 22.3582 16.6619C21.9319 16.7482 21.5055 16.7914 21.0792 16.7914C16.7734 16.7914 13.235 13.2518 13.235 8.84892C13.235 6.1295 14.5992 3.6259 16.9013 2.15827C17.1997 1.98561 17.3276 1.64029 17.285 1.33813C17.2424 0.992806 17.0292 0.733814 16.6882 0.604317C15.4945 0.215828 14.2155 0 12.9366 0C6.41392 0 1.08496 5.39568 1.08496 12C1.08496 18.6043 6.41392 24 12.9366 24C17.1571 24 21.0792 21.7122 23.2108 18C23.424 17.6547 23.424 17.2662 23.2108 17.0072Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgDarkMode;
