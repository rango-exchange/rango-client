import React from 'react';
import { IconProps } from './Icons.types';
import { SvgWithStrokeColor } from './Icons.styles';

export const AngleDownIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 18 10`}
      fill="none"
      {...props}>
      <path d="M1 1L9 9L17 1" stroke-linecap="round" stroke-linejoin="round" />
    </SvgWithStrokeColor>
  );
};

AngleDownIcon.toString = () => '._icon';
