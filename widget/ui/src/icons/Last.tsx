import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgLast(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        id="Vector"
        d="M9.6014 11.7457L0.223335 21.8285C0.082301 21.9826 0.00363768 22.1904 0.00448023 22.4067C0.00532279 22.6229 0.0856029 22.83 0.227834 22.9829C0.370064 23.1358 0.562722 23.222 0.763842 23.2229C0.964961 23.2237 1.15825 23.1391 1.3016 22.9874L11.1475 12.402C11.3152 12.2216 11.3884 11.9787 11.3673 11.7435C11.3777 11.6237 11.3634 11.5029 11.3253 11.3898C11.2873 11.2766 11.2265 11.1739 11.1473 11.0889L1.30109 0.503396C1.1581 0.349669 0.964172 0.263306 0.761958 0.263306C0.559745 0.263306 0.365814 0.349669 0.222827 0.503396C0.0798406 0.657122 -0.000488281 0.865621 -0.000488281 1.08302C-0.000488281 1.30043 0.0798406 1.50892 0.222827 1.66265L9.6014 11.7457Z"
        fill="#727272"
      />
      <path
        id="Vector_2"
        d="M18.231 11.7457L8.85222 21.8285C8.71119 21.9826 8.63252 22.1904 8.63337 22.4067C8.63421 22.6229 8.71449 22.83 8.85672 22.9829C8.99895 23.1358 9.19161 23.222 9.39273 23.2229C9.59385 23.2237 9.78713 23.1391 9.93048 22.9874L19.7764 12.402C19.9441 12.2216 20.0173 11.9787 19.9962 11.7435C20.0066 11.6237 19.9922 11.5029 19.9542 11.3898C19.9161 11.2766 19.8553 11.1739 19.7761 11.0889L9.93048 0.503396C9.7875 0.349669 9.59357 0.263306 9.39135 0.263306C9.18914 0.263306 8.99521 0.349669 8.85222 0.503396C8.70924 0.657122 8.62891 0.865621 8.62891 1.08302C8.62891 1.30043 8.70924 1.50892 8.85222 1.66265L18.231 11.7457Z"
        fill="#727272"
      />
    </svg>
  );
}
export default SvgLast;
