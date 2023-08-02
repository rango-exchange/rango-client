import * as React from 'react';
import { SvgWithFillColor } from './Icons.styles';
import { IconProps } from './Icons.types';

export const DarkThemeIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 18 20"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path d="M17.8709 13.7366C17.7331 13.5274 17.4577 13.3879 17.1822 13.4577C16.8379 13.5274 16.4935 13.5623 16.1492 13.5623C12.6714 13.5623 9.81349 10.7034 9.81349 7.1472C9.81349 4.95075 10.9154 2.92861 12.7748 1.74322C13.0158 1.60376 13.1191 1.32485 13.0846 1.0808C13.0502 0.801882 12.878 0.592696 12.6026 0.488102C11.6385 0.174323 10.6055 0 9.57245 0C4.30416 0 0 4.35805 0 9.69231C0 15.0266 4.30416 19.3846 9.57245 19.3846C12.9813 19.3846 16.1492 17.5368 17.8709 14.5385C18.043 14.2595 18.043 13.9458 17.8709 13.7366Z" />
    </SvgWithFillColor>
  );
};

DarkThemeIcon.toString = () => '._icon';
