import type { PropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import { Typography } from '@rango-dev/ui';
import React from 'react';

import { HeaderButton } from './HeaderButtons.styles';

function CancelButton(props: PropTypes) {
  return (
    <HeaderButton variant="ghost" onClick={props.onClick}>
      <Typography variant="label" size="medium" color="neutral600">
        {i18n.t('Cancel')}
      </Typography>
    </HeaderButton>
  );
}

export { CancelButton };
