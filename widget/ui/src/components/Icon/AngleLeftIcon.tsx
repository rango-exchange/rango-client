import * as React from 'react';
import { IconProps } from './types';
import { SvgWithStrokeColor } from './common';
import { AngleDownIcon } from './AngleDownIcon';

export const AngleLeftIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 32 32`}
      fill="none"
      {...props}>
      <path
        d="M20 24L12 16L20 8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

AngleDownIcon.toString = () => '._icon';
