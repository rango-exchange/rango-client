import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgArrow(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 11.6C5.77909 11.6 5.6 11.7791 5.6 12C5.6 12.2209 5.77909 12.4 6 12.4V11.6ZM18.2828 12.2828C18.4391 12.1266 18.4391 11.8734 18.2828 11.7172L15.7373 9.17157C15.581 9.01536 15.3278 9.01536 15.1716 9.17157C15.0154 9.32778 15.0154 9.58105 15.1716 9.73726L17.4343 12L15.1716 14.2627C15.0154 14.419 15.0154 14.6722 15.1716 14.8284C15.3278 14.9846 15.581 14.9846 15.7373 14.8284L18.2828 12.2828ZM6 12.4H18V11.6H6V12.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgArrow;
