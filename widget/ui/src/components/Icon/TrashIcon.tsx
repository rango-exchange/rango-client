import * as React from 'react';
import { SvgWithStrokeColor } from './Icons.style';
import { IconProps } from './Icons.type';

export const TrashIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M20.25 5.8125L19.4363 17.8919C19.2307 20.77 16.8358 23 13.9503 23H10.0497C7.16422 23 4.76929 20.77 4.5637 17.8919L3.75 5.8125M1 6.5C1 6.5 4.66667 5.125 12 5.125C19.3333 5.125 23 6.5 23 6.5M17.5 5.40977L17.387 4.44685C17.0555 2.45783 15.3346 1 13.3181 1H10.6819C8.66544 1 6.94453 2.45783 6.61302 4.44685L6.5 5.40977M15.4375 12V16.125M8.5625 12V16.125M12 10.625L12 17.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

TrashIcon.toString = () => '._icon';
