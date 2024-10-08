import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgFont(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="Icons">
        <g id="Font">
          <path
            d="M20.2235 8.41095C19.7886 8.41095 19.4469 8.07056 19.4469 7.63735V5.73429C19.4469 5.37843 19.2295 5.09994 19.0276 5.09994H4.97239C4.77049 5.09994 4.55306 5.36296 4.55306 5.73429V7.63735C4.55306 8.07056 4.21139 8.41095 3.77653 8.41095C3.34167 8.41095 3 8.07056 3 7.63735V5.73429C3 4.52747 3.88525 3.55273 4.97239 3.55273H19.0276C20.1148 3.55273 21 4.52747 21 5.73429V7.63735C21 8.05509 20.6428 8.41095 20.2235 8.41095Z"
            fill="#727272"
          />
          <path
            d="M11.9921 20.2625C11.5573 20.2625 11.2156 19.9221 11.2156 19.4889V4.32634C11.2156 3.89312 11.5573 3.55273 11.9921 3.55273C12.427 3.55273 12.7687 3.89312 12.7687 4.32634V19.4889C12.7687 19.9067 12.427 20.2625 11.9921 20.2625Z"
            fill="#727272"
          />
          <path
            d="M14.6953 20.4481H9.2906C8.85575 20.4481 8.51407 20.1077 8.51407 19.6745C8.51407 19.2413 8.85575 18.9009 9.2906 18.9009H14.6953C15.1301 18.9009 15.4718 19.2413 15.4718 19.6745C15.4718 20.1077 15.1301 20.4481 14.6953 20.4481Z"
            fill="#727272"
          />
        </g>
      </g>
    </svg>
  );
}
export default SvgFont;
