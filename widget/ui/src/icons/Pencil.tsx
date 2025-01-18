import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgPencil(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7794 3.57932C18.2423 3.04219 17.3714 3.04219 16.8343 3.57932L14.2204 6.19315L17.8069 9.77957L20.4207 7.16576V7.16576C20.9578 6.62861 20.9578 5.75769 20.4207 5.22055L18.7794 3.57932ZM16.975 10.6115L13.3886 7.02504L3.29175 17.1218C3.218 17.1956 3.17647 17.2957 3.17647 17.4001V20.8235H6.59986C6.70419 20.8235 6.80435 20.7821 6.87821 20.7082L16.975 10.6115ZM19.6114 2.74746C18.6148 1.75085 16.9989 1.75085 16.0024 2.74744V2.74744L2.4599 16.2899V16.2899C2.16542 16.5843 2 16.9838 2 17.4001V21.4118C2 21.7366 2.26336 22 2.58824 22H6.59986C7.01632 22 7.41565 21.8345 7.71003 21.5402L21.2526 7.99764C22.2491 7.00105 22.2491 5.38527 21.2526 4.38868L19.6114 2.74746Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgPencil;
