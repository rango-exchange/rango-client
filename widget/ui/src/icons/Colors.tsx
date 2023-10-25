import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgColors(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.49068 9.35508C5.80086 9.27081 6.12485 9.43296 6.24334 9.73176C6.95508 11.5267 8.48265 12.9097 10.3699 13.4254L10.3738 13.4264C10.8831 13.569 11.428 13.6418 11.9996 13.6418C12.5713 13.6418 13.1162 13.569 13.6255 13.4264C13.9367 13.3393 14.2635 13.5012 14.3828 13.8015C14.7188 14.6478 14.9048 15.5795 14.9048 16.5471C14.9048 18.7443 13.949 20.7327 12.421 22.0881C11.1043 23.2795 9.36406 24 7.45241 24C3.34076 24 0 20.659 0 16.5471C0 13.1174 2.33477 10.2125 5.49068 9.35508ZM5.30898 10.7382C2.95349 11.6086 1.26312 13.8904 1.26312 16.5471C1.26312 19.9614 4.03839 22.7368 7.45241 22.7368C9.04089 22.7368 10.4827 22.1394 11.5757 21.1495L11.5807 21.1449C12.8479 20.0219 13.6417 18.3733 13.6417 16.5471C13.6417 15.9326 13.5516 15.3369 13.3856 14.7783C12.9358 14.8631 12.4723 14.9049 11.9996 14.9049C11.3215 14.9049 10.6621 14.8187 10.0351 14.6433C7.95605 14.0747 6.24187 12.6339 5.30898 10.7382Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9991 1.26318C8.58512 1.26318 5.80986 4.0386 5.80986 7.45288C5.80986 8.25876 5.96545 9.03186 6.24334 9.73176C6.95508 11.5267 8.48265 12.9097 10.3699 13.4254L10.3738 13.4264C10.8831 13.569 11.428 13.6418 11.9996 13.6418C12.5713 13.6418 13.1162 13.569 13.6255 13.4264L13.6288 13.4261C15.5161 12.9105 17.0437 11.5275 17.7555 9.73257C18.0333 9.03266 18.1884 8.25876 18.1884 7.45288C18.1884 4.0386 15.4132 1.26318 11.9991 1.26318ZM4.54674 7.45288C4.54674 3.34099 7.8875 0 11.9991 0C16.1108 0 19.4516 3.34099 19.4516 7.45288C19.4516 8.42052 19.2655 9.3522 18.9295 10.1985C18.0727 12.3591 16.2361 14.0226 13.9637 14.6441C13.3367 14.8195 12.6778 14.9049 11.9996 14.9049C11.3215 14.9049 10.6621 14.8187 10.0351 14.6433C7.76264 14.0218 5.92563 12.3591 5.06877 10.1985M4.54674 7.45288C4.54674 8.42043 4.73285 9.35227 5.06877 10.1985L4.54674 7.45288Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7567 9.73176C17.8751 9.43296 18.1991 9.27081 18.5093 9.35508C21.6652 10.2125 24 13.1174 24 16.5471C24 20.659 20.6592 24 16.5476 24C14.6347 24 12.8934 23.2786 11.5764 22.0857C11.4433 21.9652 11.3678 21.7937 11.3688 21.6142C11.3698 21.4347 11.4464 21.264 11.5807 21.1449C12.8479 20.0219 13.6417 18.3733 13.6417 16.5471C13.6417 15.7412 13.4874 14.9676 13.2095 14.2677C13.1432 14.1007 13.1512 13.9133 13.2315 13.7525C13.3117 13.5917 13.4567 13.4727 13.6301 13.4254C15.5173 12.9097 17.0449 11.5267 17.7567 9.73176ZM18.691 10.7382C17.8554 12.4363 16.3929 13.7693 14.6027 14.4375C14.7994 15.106 14.9048 15.8163 14.9048 16.5471C14.9048 18.4806 14.1654 20.2523 12.9466 21.5733C13.9594 22.3074 15.2008 22.7368 16.5476 22.7368C19.9616 22.7368 22.7369 19.9614 22.7369 16.5471C22.7369 13.8904 21.0465 11.6086 18.691 10.7382Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgColors;
