import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgPin(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3736_40152)">
        <path
          d="M6.49636 23.6636C6.70432 23.7702 6.95035 23.7839 7.17959 23.7013C7.40926 23.6186 7.60362 23.4466 7.72026 23.2228L10.7963 17.3204L16.2882 20.1373C16.4962 20.244 16.742 20.2574 16.9716 20.1747C17.2013 20.092 17.3957 19.92 17.5121 19.6965L18.3911 18.0099C18.8976 17.038 19.0763 15.9358 18.8968 14.8896C18.7174 13.8431 18.1908 12.9174 17.406 12.2686L20.0866 7.12496L21.6556 7.92969C22.089 8.152 22.6371 7.95458 22.8797 7.48905C23.1225 7.02321 22.9678 6.46571 22.5344 6.2434L11.5507 0.609804C11.1173 0.387496 10.5693 0.584614 10.3265 1.05044C10.0839 1.51599 10.2385 2.07378 10.6719 2.29609L12.2408 3.10082L9.51628 8.32884C8.48642 8.12375 7.39804 8.28256 6.41978 8.78044C5.44136 9.27851 4.62745 10.0877 4.10411 11.0827L3.3899 12.4531C3.27342 12.6766 3.24433 12.9334 3.30908 13.1671C3.37383 13.4009 3.52702 13.592 3.73499 13.6987L9.22697 16.5155L6.15098 22.4179C6.03434 22.6417 6.00525 22.8985 6.07 23.1322C6.13464 23.3655 6.28839 23.5569 6.49636 23.6636ZM18.5178 6.32006L15.8812 11.3793L11.1737 8.96478L13.8103 3.90555L18.5178 6.32006ZM5.67369 11.8877C6.06765 11.1337 6.72388 10.5539 7.49828 10.275C8.27267 9.99607 9.10196 10.0409 9.80432 10.4L15.7867 13.4684C16.4108 13.7885 16.8706 14.362 17.0648 15.0628C17.259 15.7635 17.1715 16.5342 16.8219 17.205L16.3825 18.0481L5.39882 12.4145L5.67369 11.8877Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_3736_40152">
          <rect
            width={24}
            height={24}
            fill="white"
            transform="translate(0.227539)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgPin;
