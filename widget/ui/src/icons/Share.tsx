import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgShare(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_19665_403199)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.3333 2.34435C17.7132 2.34435 16.3999 3.65765 16.3999 5.27769C16.3999 6.89772 17.7132 8.21102 19.3333 8.21102C20.9534 8.21102 22.2666 6.89772 22.2666 5.27769C22.2666 3.65765 20.9534 2.34435 19.3333 2.34435ZM14.9333 5.27769C14.9333 2.84765 16.9032 0.877686 19.3333 0.877686C21.7634 0.877686 23.7333 2.84765 23.7333 5.27769C23.7333 7.70773 21.7634 9.67769 19.3333 9.67769C17.8132 9.67769 16.4732 8.90689 15.6827 7.73484L8.91673 10.8571C9.01448 11.2215 9.0666 11.6046 9.0666 11.9999C9.0666 12.3952 9.01449 12.7782 8.91675 13.1427L15.6828 16.2649C16.4732 15.0929 17.8132 14.3221 19.3333 14.3221C21.7634 14.3221 23.7333 16.292 23.7333 18.7221C23.7333 21.1522 21.7634 23.1221 19.3333 23.1221C16.9032 23.1221 14.9333 21.1522 14.9333 18.7221C14.9333 18.3346 14.9834 17.9588 15.0774 17.6009L8.30465 14.4755C7.51261 15.6372 6.17867 16.3999 4.6666 16.3999C2.23656 16.3999 0.266602 14.43 0.266602 11.9999C0.266602 9.56979 2.23656 7.59991 4.6666 7.59991C6.17863 7.59991 7.51254 8.36258 8.30459 9.52424L15.0774 6.39888C14.9834 6.04093 14.9333 5.66515 14.9333 5.27769ZM4.6666 9.06658C3.04656 9.06658 1.73327 10.3798 1.73327 11.9999C1.73327 13.62 3.04656 14.9332 4.6666 14.9332C6.28664 14.9332 7.59993 13.62 7.59993 11.9999C7.59993 10.3798 6.28664 9.06658 4.6666 9.06658ZM19.3333 15.7888C17.7132 15.7888 16.3999 17.102 16.3999 18.7221C16.3999 20.3422 17.7132 21.6555 19.3333 21.6555C20.9534 21.6555 22.2666 20.3422 22.2666 18.7221C22.2666 17.102 20.9534 15.7888 19.3333 15.7888Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_19665_403199">
          <rect width={24} height={24} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgShare;
