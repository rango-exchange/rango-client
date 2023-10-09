import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgReverse(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.50787 23.5806C9.21497 23.8735 8.7401 23.8735 8.44721 23.5806L1.92428 17.0576C1.63139 16.7647 1.63139 16.2899 1.92429 15.997C2.21718 15.7041 2.69206 15.7041 2.98495 15.997L9.50787 22.52C9.80076 22.8129 9.80076 23.2877 9.50787 23.5806Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.97754 23.8003C8.56333 23.8003 8.22754 23.4645 8.22754 23.0503L8.22754 0.949467C8.22754 0.535254 8.56333 0.199467 8.97754 0.199467C9.39175 0.199467 9.72754 0.535254 9.72754 0.949467L9.72754 23.0503C9.72754 23.4645 9.39175 23.8003 8.97754 23.8003Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.9849 8.00567C22.692 8.29857 22.2171 8.29856 21.9243 8.00567L15.4013 1.48268C15.1084 1.18979 15.1084 0.714912 15.4013 0.422021C15.6942 0.129129 16.1691 0.129131 16.462 0.422026L22.9849 6.94501C23.2778 7.23791 23.2778 7.71278 22.9849 8.00567Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.9297 23.8003C15.5155 23.8003 15.1797 23.4645 15.1797 23.0503L15.1797 0.949467C15.1797 0.535254 15.5155 0.199467 15.9297 0.199467C16.3439 0.199467 16.6797 0.535254 16.6797 0.949467L16.6797 23.0503C16.6797 23.4645 16.3439 23.8003 15.9297 23.8003Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgReverse;
