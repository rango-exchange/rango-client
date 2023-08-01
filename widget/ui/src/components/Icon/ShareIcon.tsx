import * as React from 'react';
import { SvgWithFillColor } from './common';
import { IconProps } from './types';

export const ShareIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path d="M14.833 21.8333H10.1663C8.55245 21.8333 7.17656 21.2643 6.03868 20.1265C4.90079 18.9886 4.33223 17.6131 4.33301 16C4.33301 14.3861 4.90195 13.0102 6.03984 11.8723C7.17773 10.7344 8.55323 10.1658 10.1663 10.1666H14.833V12.5H10.1663C9.19412 12.5 8.36773 12.8402 7.68718 13.5208C7.00662 14.2013 6.66634 15.0277 6.66634 16C6.66634 16.9722 7.00662 17.7986 7.68718 18.4791C8.36773 19.1597 9.19412 19.5 10.1663 19.5H14.833V21.8333ZM11.333 17.1666V14.8333H20.6663V17.1666H11.333ZM17.1663 21.8333V19.5H21.833C22.8052 19.5 23.6316 19.1597 24.3122 18.4791C24.9927 17.7986 25.333 16.9722 25.333 16C25.333 15.0277 24.9927 14.2013 24.3122 13.5208C23.6316 12.8402 22.8052 12.5 21.833 12.5H17.1663V10.1666H21.833C23.4469 10.1666 24.8228 10.7356 25.9607 11.8735C27.0986 13.0113 27.6671 14.3868 27.6663 16C27.6663 17.6138 27.0974 18.9897 25.9595 20.1276C24.8216 21.2655 23.4461 21.8341 21.833 21.8333H17.1663Z" />
    </SvgWithFillColor>
  );
};

ShareIcon.toString = () => '._icon';
