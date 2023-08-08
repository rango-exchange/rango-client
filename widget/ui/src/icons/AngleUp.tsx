import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgAngleUp(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 15L12 9L6 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgAngleUp;
