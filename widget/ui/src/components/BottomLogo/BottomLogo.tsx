import { i18n } from '@lingui/core';
import React from 'react';

import { Divider } from '../Divider';
import { Logo } from '../Logo/Logo';
import { Typography } from '../Typography';

import { Container, StyledAnchor } from './BottomLogo.styles';

export function BottomLogo() {
  return (
    <Container>
      <Typography variant="body" size="xsmall" color="$neutral800">
        {i18n.t('Powered By')}
      </Typography>
      <Divider direction="horizontal" size={8} />
      <StyledAnchor href="https://rango.exchange" target="_blank">
        <Logo size={14} color="black" />
        <Divider direction="horizontal" size={4} />

        <Typography variant="body" size="small" color="neutral800">
          RANGO
        </Typography>
      </StyledAnchor>
    </Container>
  );
}
