import type { IconLinkPropTypes } from './SideNavigation.types';

import { Divider, Typography } from '@rango-dev/ui';
import React from 'react';

import { IconLabelContaienr, IconWrapper } from './SideNavigation.styles';

export function IconLink(props: IconLinkPropTypes) {
  const { icon, label } = props;
  return (
    <IconLabelContaienr>
      <IconWrapper>{icon}</IconWrapper>
      <Divider size={8} />
      <Typography variant="label" size="medium" align="center">
        {label}
      </Typography>
    </IconLabelContaienr>
  );
}
