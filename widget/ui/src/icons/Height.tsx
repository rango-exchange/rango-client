import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgHeight(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="Height">
        <path
          id="Height_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.3807 23.7933C12.1204 24.0689 11.6983 24.0689 11.4379 23.7933L7.19526 19.301C6.93491 19.0254 6.93491 18.5784 7.19526 18.3028C7.45561 18.0271 7.87772 18.0271 8.13807 18.3028L11.2426 21.59V2.41003L8.13807 5.69723C7.87772 5.97289 7.45561 5.97289 7.19526 5.69723C6.93491 5.42156 6.93491 4.97462 7.19526 4.69896L11.4379 0.206747C11.6983 -0.0689157 12.1204 -0.0689157 12.3807 0.206747L16.6234 4.69896C16.8837 4.97462 16.8837 5.42156 16.6234 5.69723C16.363 5.97289 15.9409 5.97289 15.6805 5.69723L12.576 2.41003V21.59L15.6805 18.3028C15.9409 18.0271 16.363 18.0271 16.6234 18.3028C16.8837 18.5784 16.8837 19.0254 16.6234 19.301L12.3807 23.7933Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
export default SvgHeight;
