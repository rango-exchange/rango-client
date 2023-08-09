import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgNotification(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M13.6786 17.5C13.6786 18.5651 12.8151 19.4286 11.75 19.4286C10.6849 19.4286 9.82143 18.5651 9.82143 17.5M8.375 17.5C6.51104 17.5 5 15.989 5 14.125C5 13.3674 5.24964 12.668 5.67116 12.1048C6.34653 11.2023 6.92857 9.94862 6.92857 8.82143C6.92857 6.15863 9.0872 4 11.75 4C14.4128 4 16.5714 6.15863 16.5714 8.82143C16.5714 9.94862 17.1535 11.2023 17.8288 12.1048C18.2504 12.668 18.5 13.3674 18.5 14.125C18.5 15.989 16.989 17.5 15.125 17.5H8.375Z"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgNotification;
