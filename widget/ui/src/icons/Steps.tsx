import React, { createElement } from 'react';
import type { SvgIconProps } from '../components/SvgIcon';
import { SvgIcon } from '../components/SvgIcon';
function SvgSteps(props: Omit<SvgIconProps, 'type'>) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <g id="Group">
        <path
          id="Vector"
          d="M11.9433 4.50251C11.8953 4.50958 11.849 4.52457 11.8062 4.54691L3.23505 8.80397C3.0952 8.87326 3.00712 9.01269 3.00712 9.16498C3.00712 9.31727 3.0952 9.45684 3.23505 9.52613L11.8062 13.7832C11.9252 13.8417 12.0661 13.8417 12.1851 13.7832L20.7562 9.52613C20.8961 9.45684 20.9842 9.31728 20.9842 9.16498C20.9842 9.01269 20.8961 8.87326 20.7562 8.80397L12.1851 4.54691C12.1108 4.50902 12.0267 4.49346 11.9433 4.50251ZM11.9955 5.36409L19.6521 9.16504L11.9955 12.966L4.33893 9.16504L11.9955 5.36409ZM3.40491 11.7938C3.21126 11.7998 3.0475 11.9338 3.00857 12.1178C2.96963 12.3018 3.06617 12.4874 3.24174 12.5668L11.8129 16.6211C11.9284 16.6755 12.0632 16.6755 12.1786 16.6211L20.7498 12.5668C20.8539 12.5224 20.935 12.4388 20.9742 12.3353C21.0136 12.2318 21.0076 12.1171 20.9578 12.018C20.9079 11.9187 20.8186 11.8435 20.7103 11.8095C20.6021 11.7756 20.4841 11.7861 20.3839 11.8382L11.9957 15.8039L3.60744 11.8382C3.54473 11.8071 3.4752 11.7919 3.40491 11.7938ZM3.40491 14.6318C3.21126 14.6378 3.0475 14.7718 3.00857 14.9558C2.96964 15.1397 3.06617 15.3256 3.24174 15.4047L11.8129 19.4591C11.9284 19.5136 12.0632 19.5136 12.1786 19.4591L20.7498 15.4047C20.8539 15.3605 20.935 15.2769 20.9742 15.1732C21.0136 15.0697 21.0076 14.9552 20.9578 14.8559C20.9079 14.7567 20.8186 14.6814 20.7103 14.6476C20.6021 14.6137 20.4841 14.624 20.3839 14.6762L11.9957 18.6419L3.60744 14.6762C3.54473 14.6452 3.4752 14.6298 3.40491 14.6318Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={0.5}
        />
      </g>
    </svg>
  );
}
export default SvgSteps;
