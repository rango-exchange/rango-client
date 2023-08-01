import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const GasIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M15.584 8.77C16.0631 8.77 16.5226 8.96025 16.8613 9.29909C17.2001 9.63792 17.3904 10.0973 17.3904 10.5764V16.0194C17.4177 16.6454 17.7673 17.2127 18.3146 17.5182C18.8618 17.8237 19.5283 17.8237 20.0755 17.5182C20.6229 17.2127 20.9725 16.6454 20.9998 16.0194V0.973022"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.1361 18.9211V3.88159C15.1343 3.24426 14.8803 2.63363 14.4297 2.18299C13.979 1.73235 13.3684 1.47833 12.7311 1.47656H4.90683C4.26949 1.47834 3.65873 1.73235 3.20809 2.18299C2.75744 2.63362 2.50343 3.24426 2.50166 3.88159V18.9211H0.998047V21.0269H16.6465V18.9211H15.1361Z"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.5143 3.68005H12.1173C12.4499 3.68005 12.7195 4.01266 12.7195 4.28225V8.15354C12.7195 8.48614 12.4499 8.75573 12.1173 8.75573H5.5143C5.1817 8.75573 4.91211 8.42313 4.91211 8.15354V4.28225C4.91211 3.94965 5.18169 3.68005 5.5143 3.68005Z"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20.6002 3.68005L19.4062 5.26878C19.1472 5.6088 19.0705 6.05381 19.2015 6.4607C19.3324 6.8676 19.654 7.18478 20.0627 7.30977L21.0016 7.58869"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

GasIcon.toString = () => '._icon';
