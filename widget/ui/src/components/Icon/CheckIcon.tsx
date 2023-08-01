import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const CheckIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M26.6668 9.33334L12.943 23.0572C12.4223 23.5779 11.5781 23.5779 11.0574 23.0572L5.3335 17.3333"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgWithStrokeColor>
  );
};

CheckIcon.toString = () => '._icon';
