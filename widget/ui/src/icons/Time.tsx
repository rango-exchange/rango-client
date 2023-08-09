import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgTime(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <g id="Group">
        <g id="Group 1000006265">
          <path
            id="Vector"
            d="M15.438 10.3275C15.7973 10.3275 16.142 10.4702 16.396 10.7243C16.6501 10.9784 16.7928 11.3229 16.7928 11.6823V15.7645C16.8133 16.234 17.0755 16.6595 17.486 16.8886C17.8964 17.1177 18.3963 17.1177 18.8066 16.8886C19.2171 16.6595 19.4794 16.234 19.4998 15.7645V4.47974"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_2"
            d="M15.1021 17.9408V6.66113C15.1007 6.18313 14.9102 5.72516 14.5722 5.38718C14.2343 5.0492 13.7763 4.85869 13.2983 4.85736H7.43012C6.95212 4.8587 6.49404 5.0492 6.15606 5.38718C5.81808 5.72516 5.62757 6.18313 5.62624 6.66113V17.9408H4.49854V19.5201H16.2349V17.9408H15.1021Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_3"
            d="M7.88573 6.51001H12.838C13.0874 6.51001 13.2896 6.75946 13.2896 6.96165V9.86512C13.2896 10.1146 13.0874 10.3168 12.838 10.3168H7.88573C7.63628 10.3168 7.43408 10.0673 7.43408 9.86512V6.96165C7.43408 6.7122 7.63627 6.51001 7.88573 6.51001Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_4"
            d="M19.2002 6.51001L18.3047 7.70155C18.1104 7.95657 18.0529 8.29033 18.1511 8.5955C18.2493 8.90067 18.4905 9.13856 18.797 9.2323L19.5012 9.44149"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
export default SvgTime;
