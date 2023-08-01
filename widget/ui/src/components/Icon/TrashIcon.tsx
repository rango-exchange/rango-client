import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const TrashIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M24.25 9.8125L23.4363 21.8919C23.2307 24.77 20.8358 27 17.9503 27H14.0497C11.1642 27 8.76929 24.77 8.5637 21.8919L7.75 9.8125M5 10.5C5 10.5 8.66667 9.125 16 9.125C23.3333 9.125 27 10.5 27 10.5M21.5 9.40977L21.387 8.44685C21.0555 6.45783 19.3346 5 17.3181 5H14.6819C12.6654 5 10.9445 6.45783 10.613 8.44685L10.5 9.40977M19.4375 16V20.125M12.5625 16V20.125M16 14.625L16 21.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

TrashIcon.toString = () => '._icon';
