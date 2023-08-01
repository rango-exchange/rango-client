import * as React from 'react';
import { SvgWithStrokeColor } from './common';
import { IconProps } from './types';

export const HistoryIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        d="M19.995 24.9959C17.4923 24.9959 14.703 24.9936 12.0064 24.9936C9.79276 24.9936 7.99788 23.1974 8 20.9838C8.00332 17.5314 8.00332 14.4604 8 11.0079C7.99788 8.79433 9.79285 6.99849 12.0065 7C14.6654 7.00181 17.3244 7.00181 19.9834 7C22.197 6.99849 23.992 8.79402 23.9915 11.0076C23.9908 14.3082 23.9949 17.245 23.9949 20.9959M19.995 24.9959V21.9959C19.995 21.4436 20.4427 20.9959 20.995 20.9959H23.9949M19.995 24.9959L23.9949 20.9959M11.995 10.9959H19.9949M11.995 13.9959H19.9949M11.995 16.9959H15.995"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

HistoryIcon.toString = () => '._icon';
