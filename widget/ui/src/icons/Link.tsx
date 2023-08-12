import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgLink(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.477539 12.0001C0.477539 9.15583 2.78327 6.8501 5.62754 6.8501H7.82754C8.24175 6.8501 8.57754 7.18588 8.57754 7.6001C8.57754 8.01431 8.24175 8.3501 7.82754 8.3501H5.62754C3.6117 8.3501 1.97754 9.98426 1.97754 12.0001C1.97754 14.0159 3.6117 15.6501 5.62754 15.6501H7.82754C8.24175 15.6501 8.57754 15.9859 8.57754 16.4001C8.57754 16.8143 8.24175 17.1501 7.82754 17.1501H5.62754C2.78327 17.1501 0.477539 14.8444 0.477539 12.0001ZM15.8775 7.6001C15.8775 7.18588 16.2133 6.8501 16.6275 6.8501H18.8275C21.6718 6.8501 23.9775 9.15583 23.9775 12.0001C23.9775 14.8444 21.6718 17.1501 18.8275 17.1501H16.6275C16.2133 17.1501 15.8775 16.8143 15.8775 16.4001C15.8775 15.9859 16.2133 15.6501 16.6275 15.6501H18.8275C20.8434 15.6501 22.4775 14.0159 22.4775 12.0001C22.4775 9.98426 20.8434 8.3501 18.8275 8.3501H16.6275C16.2133 8.3501 15.8775 8.01431 15.8775 7.6001ZM7.07754 12.0001C7.07754 11.5859 7.41333 11.2501 7.82754 11.2501H16.6275C17.0418 11.2501 17.3775 11.5859 17.3775 12.0001C17.3775 12.4143 17.0418 12.7501 16.6275 12.7501H7.82754C7.41333 12.7501 7.07754 12.4143 7.07754 12.0001Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgLink;
