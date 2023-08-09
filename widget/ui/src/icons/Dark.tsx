import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgDark(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <g id="Group">
        <path
          id="Vector"
          d="M17.9067 14.9209C17.8073 14.7698 17.6083 14.6691 17.4094 14.7194C17.1607 14.7698 16.912 14.795 16.6633 14.795C14.1516 14.795 12.0875 12.7302 12.0875 10.1619C12.0875 8.57554 12.8833 7.11511 14.2262 6.25899C14.4003 6.15827 14.4749 5.95683 14.45 5.78058C14.4252 5.57914 14.3008 5.42806 14.1019 5.35252C13.4055 5.1259 12.6595 5 11.9134 5C8.10856 5 5 8.14748 5 12C5 15.8525 8.10856 19 11.9134 19C14.3754 19 16.6633 17.6655 17.9067 15.5C18.0311 15.2986 18.0311 15.0719 17.9067 14.9209Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
export default SvgDark;
