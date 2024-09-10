import { i18n } from '@lingui/core';
import React from 'react';

import { Divider } from '../Divider/index.js';
import { Logo } from '../Logo/index.js';
import { Typography } from '../Typography/index.js';

import { Container, StyledAnchor } from './BottomLogo.styles.js';

export function BottomLogo() {
  return (
    <Container>
      <Typography variant="body" size="xsmall" color="$neutral700">
        {i18n.t('Powered By')}
      </Typography>
      <Divider direction="horizontal" size={8} />
      <StyledAnchor href="https://rango.exchange" target="_blank">
        <Logo size={16} color="gray" />
        <Divider direction="horizontal" size={4} />

        <Typography variant="body" size="xsmall" color="neutral700">
          RANGO
        </Typography>
      </StyledAnchor>
    </Container>
  );
}
