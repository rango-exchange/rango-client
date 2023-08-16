import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgSearch(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.058 4.04189C14.3131 0.296976 8.2414 0.296976 4.49648 4.04189C0.751566 7.78681 0.751566 13.8585 4.49648 17.6034C8.2414 21.3483 14.3131 21.3483 18.058 17.6034C21.8029 13.8585 21.8029 7.78681 18.058 4.04189ZM18.93 3.16988C14.7035 -1.05663 7.85098 -1.05663 3.62447 3.16988C-0.602038 7.39639 -0.602038 14.2489 3.62447 18.4754C7.85098 22.7019 14.7035 22.7019 18.93 18.4754C23.1565 14.2489 23.1565 7.39639 18.93 3.16988Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0517 17.5971C18.2925 17.3563 18.6829 17.3563 18.9237 17.5971L24.2739 22.9473C24.5147 23.1881 24.5147 23.5785 24.2739 23.8193C24.0331 24.0601 23.6427 24.0601 23.4019 23.8193L18.0517 18.4691C17.8109 18.2283 17.8109 17.8379 18.0517 17.5971Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgSearch;
