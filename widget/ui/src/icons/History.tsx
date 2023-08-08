import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgHistory(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M14.9962 18.7469C13.1192 18.7469 11.0272 18.7452 9.00479 18.7452C7.34457 18.7452 5.99841 17.3981 6 15.7379C6.00249 13.1486 6.00249 10.8453 6 8.25596C5.99841 6.59575 7.34464 5.24887 9.00486 5.25C10.9991 5.25136 12.9933 5.25136 14.9875 5.25C16.6478 5.24887 17.994 6.59552 17.9936 8.25573C17.9931 10.7311 17.9962 12.9338 17.9962 15.7469M14.9962 18.7469V16.4969C14.9962 16.0827 15.332 15.7469 15.7462 15.7469H17.9962M14.9962 18.7469L17.9962 15.7469M8.99624 8.24692H14.9962M8.99624 10.4969H14.9962M8.99624 12.7469H11.9962"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgHistory;
