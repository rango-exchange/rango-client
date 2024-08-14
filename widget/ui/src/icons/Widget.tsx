import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgWidget(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="Icons">
        <path
          id="Widget"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 7.76471C3 5.13323 5.13323 3 7.76471 3L16.2353 3C18.8668 3 21 5.13323 21 7.76471V16.2353C21 18.8668 18.8668 21 16.2353 21H7.76471C5.13323 21 3 18.8668 3 16.2353L3 7.76471ZM19.9412 11.4706V7.76471C19.9412 5.718 18.282 4.05882 16.2353 4.05882L10.4118 4.05882V11.4706L19.9412 11.4706ZM19.9412 12.5294V16.2353C19.9412 18.282 18.282 19.9412 16.2353 19.9412H7.76471C5.718 19.9412 4.05882 18.282 4.05882 16.2353L4.05882 12.5294L9.88235 12.5294H19.9412ZM9.35294 11.4706V4.05882L7.76471 4.05882C5.718 4.05882 4.05882 5.718 4.05882 7.76471L4.05882 11.4706L9.35294 11.4706Z"
          fill="#727272"
        />
      </g>
    </svg>
  );
}
export default SvgWidget;
