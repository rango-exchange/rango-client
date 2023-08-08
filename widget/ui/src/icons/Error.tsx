import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgError(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none">
      <rect width={30} height={30} rx={15} fill="#FFD7D7" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 5.5C9.756 5.5 5.5 9.756 5.5 15C5.5 20.244 9.756 24.5 15 24.5C20.244 24.5 24.5 20.244 24.5 15C24.5 9.756 20.244 5.5 15 5.5ZM14.05 19.75V17.85H15.95V19.75H14.05ZM14.05 10.25V15.95H15.95V10.25H14.05Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgError;
