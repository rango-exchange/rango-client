import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgInfo(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.2133 10.1543C11.969 10.1582 11.736 10.2584 11.5656 10.4334C11.3952 10.6082 11.3015 10.8434 11.3048 11.0872V17.5287C11.3013 17.775 11.3971 18.0125 11.5705 18.1879C11.744 18.3633 11.9807 18.4619 12.2278 18.4619C12.475 18.4619 12.7117 18.3633 12.8852 18.1879C13.0587 18.0124 13.1543 17.775 13.1507 17.5287V11.0872C13.1543 10.8385 13.0566 10.599 12.8798 10.4232C12.7033 10.2475 12.4628 10.1504 12.2133 10.1543Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.1508 7.38487C13.1508 7.89462 12.7375 8.30795 12.2278 8.30795C11.718 8.30795 11.3047 7.89462 11.3047 7.38487C11.3047 6.87511 11.718 6.46179 12.2278 6.46179C12.7375 6.46179 13.1508 6.87511 13.1508 7.38487Z"
        fill="currentColor"
      />
      <path
        d="M12.2275 0.00012207C5.6104 0.00012207 0.227539 5.38298 0.227539 12.0001C0.227539 18.6173 5.6104 24.0001 12.2275 24.0001C18.8447 24.0001 24.2275 18.6173 24.2275 12.0001C24.2275 5.38298 18.8447 0.00012207 12.2275 0.00012207ZM12.2275 1.71441C17.9185 1.71441 22.5133 6.30928 22.5133 12.0001C22.5133 17.691 17.9184 22.2858 12.2275 22.2858C6.5367 22.2858 1.94182 17.691 1.94182 12.0001C1.94182 6.30928 6.5367 1.71441 12.2275 1.71441Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgInfo;