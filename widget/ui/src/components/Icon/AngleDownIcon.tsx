import React from 'react';
import { IconProps } from './types';
import { SvgWithStrokeColor } from './common';

export const AngleDownIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 32 32`}
      fill="none"
      {...props}>
      <path
        d="M8 12L16 20L24 12"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

AngleDownIcon.toString = () => '._icon';
