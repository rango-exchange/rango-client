import * as React from 'react';
import { SvgWithFillColor } from './common';
import { IconProps } from './types';

export const DarkThemeIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path d="M24.8709 19.7366C24.7331 19.5274 24.4577 19.3879 24.1822 19.4577C23.8379 19.5274 23.4935 19.5623 23.1492 19.5623C19.6714 19.5623 16.8135 16.7034 16.8135 13.1472C16.8135 10.9507 17.9154 8.92861 19.7748 7.74322C20.0158 7.60376 20.1191 7.32485 20.0846 7.0808C20.0502 6.80188 19.878 6.5927 19.6026 6.4881C18.6385 6.17432 17.6055 6 16.5725 6C11.3042 6 7 10.3581 7 15.6923C7 21.0266 11.3042 25.3846 16.5725 25.3846C19.9813 25.3846 23.1492 23.5368 24.8709 20.5385C25.043 20.2595 25.043 19.9458 24.8709 19.7366Z" />
    </SvgWithFillColor>
  );
};

DarkThemeIcon.toString = () => '._icon';
