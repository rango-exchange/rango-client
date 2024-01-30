import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgX(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        d="M18.0955 14.3165L26.2864 5H24.3456L17.2303 13.0877L11.5514 5H5L13.5895 17.2311L5 27H6.94072L14.4501 18.4571L20.4486 27H27L18.0955 14.3165ZM15.4365 17.3385L14.5649 16.1198L7.64059 6.43161H10.6219L16.2117 14.2532L17.0797 15.4719L24.3447 25.6381H21.3634L15.4365 17.3385Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgX;
