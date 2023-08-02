import * as React from 'react';
import { IconProps } from './Icons.types';
import { SvgWithStrokeColor } from './Icons.styles';

export const AngleRightIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 10 18`}
      fill="none"
      {...props}>
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M1 17L9 9L1 1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

AngleRightIcon.toString = () => '._icon';
