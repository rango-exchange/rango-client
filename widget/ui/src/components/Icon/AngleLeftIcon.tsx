import * as React from 'react';
import { IconProps } from './Icons.type';
import { SvgWithStrokeColor } from './Icons.style';
import { AngleDownIcon } from './AngleDownIcon';

export const AngleLeftIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 10 18`}
      fill="none"
      {...props}>
      <path d="M9 17L1 9L9 1" stroke-linecap="round" stroke-linejoin="round" />
    </SvgWithStrokeColor>
  );
};

AngleDownIcon.toString = () => '._icon';
