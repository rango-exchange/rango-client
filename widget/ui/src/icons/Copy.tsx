import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgCopy(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        id="Vector"
        d="M12.4702 3.72088H9.56418V1.3023C9.56235 0.957457 9.43575 0.627418 9.21174 0.383589C8.98773 0.139775 8.68439 0.00184985 8.36765 0H1.52991C1.21316 0.00186876 0.909838 0.139785 0.68581 0.383589C0.461798 0.627402 0.335191 0.957426 0.333374 1.3023V10.9767C0.335206 11.3215 0.461806 11.6517 0.68581 11.8955C0.909823 12.1393 1.21316 12.2771 1.52991 12.2791H4.4359V14.6977C4.43773 15.0425 4.56433 15.3726 4.78834 15.6164C5.01235 15.8602 5.31569 15.9981 5.63243 16H12.4702C12.7869 15.9981 13.0902 15.8602 13.3143 15.6164C13.5383 15.3726 13.6649 15.0426 13.6667 14.6977V5.0233C13.6649 4.67846 13.5383 4.3483 13.3143 4.10447C13.0903 3.86065 12.7869 3.72286 12.4702 3.72088ZM1.5302 11.1627L1.53008 11.1628C1.43576 11.1628 1.35918 11.0795 1.35918 10.9767V1.3023C1.35918 1.19951 1.43576 1.11629 1.53008 1.11629H8.36783C8.41316 1.11629 8.45665 1.13585 8.4887 1.17073C8.52076 1.20562 8.53872 1.25296 8.53872 1.3023V3.72088H5.63273C5.31598 3.72287 5.01266 3.86066 4.78863 4.10447C4.56462 4.34828 4.43801 4.67843 4.4362 5.0233V11.1629L1.5302 11.1627ZM12.641 14.6978C12.641 14.7472 12.623 14.7945 12.591 14.8294C12.5589 14.8643 12.5154 14.8838 12.4701 14.8838H5.63237C5.53805 14.8838 5.46147 14.8006 5.46147 14.6978V5.02343C5.46147 4.92065 5.53805 4.8373 5.63237 4.8373H12.4701C12.5154 4.8373 12.5589 4.85698 12.591 4.89187C12.623 4.92675 12.641 4.97409 12.641 5.02343V14.6978Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgCopy;
