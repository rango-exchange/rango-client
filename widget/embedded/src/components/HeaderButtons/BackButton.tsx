import type { PropTypes } from './HeaderButtons.types';

import { ChevronLeftIcon } from '@arlert-dev/ui';
import React from 'react';

import { HeaderButton } from './HeaderButtons.styles';

function BackButton(props: PropTypes) {
  return (
    <HeaderButton
      id="widget-header-back-icon-btn"
      variant="ghost"
      size="small"
      onClick={props.onClick}>
      <ChevronLeftIcon color="black" size={16} />
    </HeaderButton>
  );
}

export { BackButton };
