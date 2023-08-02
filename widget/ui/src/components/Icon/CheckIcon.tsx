import * as React from 'react';
import { SvgWithStrokeColor } from './Icons.style';
import { IconProps } from './Icons.type';

export const CheckIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 24 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M22.6668 1.33334L8.94297 15.0572C8.42227 15.5779 7.57805 15.5779 7.05735 15.0572L1.3335 9.33334"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgWithStrokeColor>
  );
};

CheckIcon.toString = () => '._icon';
