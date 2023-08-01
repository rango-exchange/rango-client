import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const NotificationIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M18.2857 23C18.2857 24.2624 17.2624 25.2857 16 25.2857C14.7376 25.2857 13.7143 24.2624 13.7143 23M12 23C9.79086 23 8 21.2091 8 19C8 18.1021 8.29587 17.2732 8.79545 16.6057C9.59589 15.5361 10.2857 14.0502 10.2857 12.7143C10.2857 9.55837 12.8441 7 16 7C19.1559 7 21.7143 9.55837 21.7143 12.7143C21.7143 14.0502 22.4041 15.5361 23.2046 16.6057C23.7041 17.2732 24 18.1021 24 19C24 21.2091 22.2091 23 20 23H12Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

NotificationIcon.toString = () => '._icon';
