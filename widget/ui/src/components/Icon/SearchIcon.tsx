import * as React from 'react';
import { SvgWithStrokeColor } from './Icons.styles';
import { IconProps } from './Icons.types';

export const SearchIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M20.9516 9.11756C24.2195 12.3855 24.2195 17.6838 20.9516 20.9517C17.6837 24.2196 12.3853 24.2196 9.11743 20.9517C5.84953 17.6838 5.84953 12.3855 9.11743 9.11756C12.3853 5.84965 17.6837 5.84965 20.9516 9.11756"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25.3334 25.3333L20.9468 20.9467"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

SearchIcon.toString = () => '._icon';
