import * as React from 'react';
import { IconProps } from './types';
import { SvgWithStrokeColor } from './common';

export const AngleRightIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 32 32`}
      fill="none"
      {...props}>
      <path
        d="M12 24L20 16L12 8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

AngleRightIcon.toString = () => '._icon';
