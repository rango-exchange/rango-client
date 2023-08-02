import * as React from 'react';
import { SvgWithFillColor } from './Icons.styles';
import { IconProps } from './Icons.types';

export const LightThemeIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path d="M10.5168 1.46292e-05C10.5018 0.00154486 10.4869 0.00403826 10.4722 0.00745607C10.3841 0.0185282 10.3033 0.0620037 10.2455 0.129411C10.1877 0.196819 10.1571 0.283326 10.1596 0.372072V3.2072C10.279 3.20139 10.396 3.19232 10.5168 3.19232C10.6352 3.19232 10.757 3.20163 10.874 3.2072V0.372072C10.876 0.32393 10.8682 0.275881 10.8512 0.230816C10.8341 0.18575 10.8081 0.144593 10.7748 0.109834C10.7414 0.0750748 10.7014 0.0474212 10.657 0.028545C10.6127 0.00966877 10.565 -2.05136e-05 10.5168 1.46292e-05ZM3.32088 2.96922C3.25326 2.97583 3.18892 3.00157 3.13542 3.04345C3.08192 3.08533 3.04147 3.14159 3.01882 3.20565C2.99616 3.2697 2.99225 3.33888 3.00752 3.40508C3.0228 3.47129 3.05664 3.53177 3.10507 3.57942L5.11426 5.58861C5.27569 5.41083 5.44216 5.24373 5.62028 5.08259L3.61109 3.0734C3.57357 3.03546 3.52802 3.00641 3.4778 2.98838C3.42757 2.97035 3.37396 2.96381 3.32088 2.96922ZM17.6308 2.96922C17.549 2.97807 17.4728 3.01487 17.415 3.0734L15.4058 5.08259C15.5829 5.24252 15.7587 5.40479 15.9193 5.58117L17.921 3.57943C17.9742 3.52737 18.0098 3.46 18.0228 3.38673C18.0358 3.31346 18.0256 3.23795 17.9937 3.17075C17.9617 3.10355 17.9096 3.04801 17.8445 3.01188C17.7794 2.97575 17.7048 2.96083 17.6308 2.96922ZM10.5018 4.33845C7.11946 4.33845 4.37744 7.08785 4.37744 10.4702C4.37744 13.8525 7.11923 16.6019 10.5018 16.6019C13.8841 16.6019 16.6336 13.8528 16.6336 10.4702C16.6336 7.08785 13.8841 4.33845 10.5018 4.33845ZM0.321916 10.113C0.227183 10.1229 0.140251 10.17 0.0802426 10.2439C0.0202343 10.3179 -0.00793415 10.4127 0.00193381 10.5074C0.0118018 10.6021 0.0588978 10.6891 0.132861 10.7491C0.206825 10.8091 0.301598 10.8373 0.39633 10.8274H3.23908C3.2335 10.7107 3.2242 10.5957 3.2242 10.4776C3.2242 10.357 3.23325 10.2322 3.23908 10.113H0.39633C0.383936 10.1124 0.371517 10.1124 0.359123 10.113C0.346729 10.1124 0.33431 10.1124 0.321916 10.113ZM17.8018 10.113C17.8076 10.2322 17.8092 10.357 17.8092 10.4776C17.8092 10.5956 17.8074 10.7107 17.8018 10.8274H20.6369C20.6843 10.8282 20.7314 10.8195 20.7754 10.8019C20.8194 10.7843 20.8595 10.7581 20.8933 10.7248C20.9271 10.6916 20.9539 10.652 20.9722 10.6082C20.9906 10.5645 21 10.5176 21 10.4702C21 10.4228 20.9906 10.3759 20.9722 10.3321C20.9539 10.2884 20.9271 10.2488 20.8933 10.2155C20.8595 10.1823 20.8194 10.1561 20.7754 10.1385C20.7314 10.1209 20.6843 10.1122 20.6369 10.113H17.8018ZM5.1142 15.3518L3.10501 17.361C3.07179 17.3942 3.04543 17.4336 3.02745 17.477C3.00947 17.5204 3.00021 17.567 3.00021 17.614C3.00021 17.7089 3.03791 17.7999 3.10501 17.867C3.17212 17.9341 3.26313 17.9718 3.35802 17.9718C3.45292 17.9718 3.54393 17.9341 3.61103 17.867L5.61277 15.8578C5.43607 15.6975 5.27444 15.5285 5.1142 15.3518ZM15.9192 15.3665C15.7598 15.5415 15.5887 15.7063 15.4132 15.8651L17.4149 17.8669C17.482 17.934 17.573 17.9717 17.6679 17.9717C17.7628 17.9717 17.8538 17.934 17.9209 17.8669C17.988 17.7998 18.0257 17.7087 18.0257 17.6138C18.0257 17.5189 17.988 17.4279 17.9209 17.3608L15.9192 15.3665ZM10.1594 17.7404V20.5755C10.1586 20.6229 10.1673 20.67 10.1849 20.714C10.2025 20.758 10.2287 20.7981 10.2619 20.8319C10.2952 20.8657 10.3348 20.8925 10.3785 20.9108C10.4222 20.9291 10.4692 20.9386 10.5166 20.9386C10.564 20.9386 10.6109 20.9291 10.6546 20.9108C10.6983 20.8925 10.738 20.8657 10.7712 20.8319C10.8045 20.7981 10.8307 20.758 10.8483 20.714C10.8659 20.67 10.8745 20.6229 10.8738 20.5755V17.7404C10.7567 17.7461 10.635 17.7551 10.5166 17.7551C10.3958 17.7551 10.2787 17.7461 10.1594 17.7404Z" />
    </SvgWithFillColor>
  );
};

LightThemeIcon.toString = () => '._icon';
