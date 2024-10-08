import type { SvgIconPropsWithChildren } from '../components/SvgIcon/index.js';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon/index.js';

function SvgInfoError(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 24C9.62663 24 7.30655 23.2962 5.33316 21.9776C3.35977 20.6591 1.8217 18.7849 0.913451 16.5922C0.00519935 14.3995 -0.232441 11.9867 0.230582 9.65892C0.693604 7.33115 1.83649 5.19295 3.51472 3.51472C5.19295 1.83649 7.33115 0.693604 9.65892 0.230582C11.9867 -0.232441 14.3995 0.00519935 16.5922 0.913451C18.7849 1.8217 20.6591 3.35977 21.9776 5.33316C23.2962 7.30655 24 9.62663 24 12C23.9964 15.1815 22.731 18.2317 20.4813 20.4813C18.2317 22.731 15.1815 23.9964 12 24ZM9.91412 8.40428V9.70711L11.5837 9.99513V17.9201L9.91412 18.2081V19.4997H15.2762V18.2081L13.6066 17.9201V8.40428H9.91412ZM11.5837 3.50122V5.56235H13.6089V3.50122H11.5837Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgInfoError;
