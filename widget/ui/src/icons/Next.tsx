import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgNext(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.3231 7.40376L23.4597 11.5403C23.7136 11.7942 23.7136 12.2057 23.4597 12.4596L19.3231 16.5961C19.0693 16.85 18.6577 16.85 18.4039 16.5961C18.1501 16.3423 18.1501 15.9307 18.4039 15.6769L21.4309 12.65H1.0001C0.641113 12.65 0.350098 12.3589 0.350098 12C0.350098 11.641 0.641113 11.35 1.0001 11.35H21.4309L18.4039 8.323C18.1501 8.06916 18.1501 7.6576 18.4039 7.40376C18.6577 7.14992 19.0693 7.14992 19.3231 7.40376Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgNext;
