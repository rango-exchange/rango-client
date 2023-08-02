import * as React from 'react';
import { SvgWithStrokeColor } from './Icons.styles';
import { IconProps } from './Icons.types';

export const HistoryIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithStrokeColor
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M12.995 18.9959C10.4923 18.9959 7.70298 18.9936 5.00638 18.9936C2.79276 18.9936 0.997877 17.1974 1 14.9838C1.00332 11.5314 1.00332 8.46036 1 5.00795C0.997877 2.79433 2.79285 0.998491 5.00647 1C7.66544 1.00181 10.3244 1.00181 12.9834 1C15.197 0.998491 16.992 2.79402 16.9915 5.00764C16.9908 8.30816 16.9949 11.245 16.9949 14.9959M12.995 18.9959V15.9959C12.995 15.4436 13.4427 14.9959 13.995 14.9959H16.9949M12.995 18.9959L16.9949 14.9959M4.99498 4.99589H12.9949M4.99498 7.99589H12.9949M4.99498 10.9959H8.99498"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgWithStrokeColor>
  );
};

HistoryIcon.toString = () => '._icon';
