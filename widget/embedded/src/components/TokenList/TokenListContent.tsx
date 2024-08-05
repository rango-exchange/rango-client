/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './TokenList.types';

import { i18n } from '@lingui/core';
import { Divider, Typography } from '@rango-dev/ui';
import React from 'react';

import { TokenList } from './TokenList';
import { Container } from './TokenList.styles';

export function TokenListContent(props: PropTypes) {
  return (
    <Container>
      <Typography variant="label" size="large">
        {i18n.t('Select Token')}
      </Typography>
      <Divider size={4} />
      <TokenList {...props} />
    </Container>
  );
}
