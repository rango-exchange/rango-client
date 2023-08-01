import * as React from 'react';
import { IconProps } from './types';
import { SvgWithStrokeColor } from './common';

export const AngleUpIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 32 32`}
      fill="none"
      {...props}>
      <path
        d="M24 20L16 12L8 20"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

AngleUpIcon.toString = () => '._icon';
