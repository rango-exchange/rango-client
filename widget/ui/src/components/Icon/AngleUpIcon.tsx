import * as React from 'react';
import { IconProps } from './Icons.types';
import { SvgWithStrokeColor } from './Icons.styles';

export const AngleUpIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 18 10`}
      fill="none"
      {...props}>
      <path d="M17 9L9 1L1 9" stroke-linecap="round" stroke-linejoin="round" />
    </SvgWithStrokeColor>
  );
};

AngleUpIcon.toString = () => '._icon';
