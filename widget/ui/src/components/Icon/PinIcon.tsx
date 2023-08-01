import * as React from 'react';
import { SvgWithFillColor } from './common';
import { IconProps } from './types';

export const PinIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 19 24"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path d="M3.09813 23.0888C3.29818 23.1915 3.53486 23.2046 3.75539 23.1252C3.97633 23.0456 4.1633 22.8801 4.2755 22.6648L7.23457 16.9868L12.5178 19.6966C12.7178 19.7992 12.9543 19.8122 13.1752 19.7326C13.3961 19.653 13.5831 19.4876 13.6952 19.2726L14.5407 17.6501C15.028 16.7151 15.1999 15.6548 15.0272 14.6484C14.8546 13.6417 14.348 12.7512 13.5931 12.127L16.1718 7.1789L17.6811 7.95304C18.098 8.1669 18.6253 7.97699 18.8587 7.52916C19.0923 7.08103 18.9434 6.54471 18.5265 6.33086L7.96032 0.911411C7.54337 0.697554 7.01623 0.887179 6.7827 1.3353C6.5493 1.78315 6.69798 2.31974 7.11493 2.5336L8.62425 3.30773L6.00325 8.33703C5.01255 8.13973 3.96554 8.2925 3.02446 8.77145C2.08323 9.25059 1.30026 10.029 0.796813 10.9862L0.109757 12.3045C-0.00229829 12.5195 -0.0302834 12.7666 0.0320057 12.9914C0.0943015 13.2162 0.241668 13.4001 0.441724 13.5027L5.72494 16.2125L2.76588 21.8905C2.65367 22.1058 2.62569 22.3528 2.68798 22.5777C2.75016 22.8021 2.89807 22.9862 3.09813 23.0888ZM14.6626 6.4046L12.1262 11.2715L7.59767 8.94879L10.134 4.08188L14.6626 6.4046ZM2.30673 11.7606C2.68572 11.0353 3.31701 10.4775 4.06196 10.2092C4.80691 9.94088 5.60468 9.98402 6.28035 10.3295L12.0353 13.2812C12.6357 13.5892 13.078 14.1409 13.2648 14.815C13.4516 15.4891 13.3675 16.2305 13.0312 16.8758L12.6085 17.6869L2.04231 12.2674L2.30673 11.7606Z" />
      ]
    </SvgWithFillColor>
  );
};

PinIcon.toString = () => '._icon';
