import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgChevronUp(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.17976 17.6273C1.41944 17.867 1.80803 17.867 2.04771 17.6273L12 7.67504L21.9523 17.6273C22.192 17.867 22.5806 17.867 22.8202 17.6273C23.0599 17.3877 23.0599 16.9991 22.8202 16.7594L12.434 6.37312C12.1943 6.13344 11.8057 6.13344 11.566 6.37312L1.17976 16.7594C0.940081 16.9991 0.940081 17.3877 1.17976 17.6273Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgChevronUp;
