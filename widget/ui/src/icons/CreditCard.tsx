import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgCreditCard(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.9529 17.8164V6.88069C23.9529 5.29233 22.6605 4 21.0722 4H2.88069C1.29233 4 0 5.29244 0 6.88069V17.8164C0 19.4047 1.29244 20.6971 2.88069 20.6971H21.0722C22.6606 20.6971 23.9529 19.4046 23.9529 17.8164ZM2.88042 5.40869H21.072C21.8836 5.40869 22.5441 6.06918 22.5441 6.8808V8.5537H1.40826V6.8808C1.40826 6.06918 2.06881 5.40869 2.88042 5.40869ZM1.40831 17.8164V9.96239H22.5441V17.8164C22.5441 18.628 21.8836 19.2885 21.072 19.2885H2.88047C2.06886 19.2885 1.40831 18.628 1.40831 17.8164Z"
        fill="currentColor"
      />
      <path
        d="M20.2882 15.6025H17.66C17.2711 15.6025 16.9551 15.9175 16.9551 16.3074C16.9551 16.6963 17.27 17.0123 17.66 17.0123H20.2882C20.6771 17.0123 20.9931 16.6974 20.9931 16.3074C20.992 15.9175 20.6771 15.6025 20.2882 15.6025Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgCreditCard;
