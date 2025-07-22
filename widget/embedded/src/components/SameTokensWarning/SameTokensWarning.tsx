import { i18n } from '@lingui/core';
import { Alert, Divider, NoRouteIcon, Typography } from '@arlert-dev/ui';
import React from 'react';

import { useQuoteStore } from '../../store/quote';
import { areTokensEqual } from '../../utils/wallets';

import { Container } from './SameTokensWarning.styles';

export function SameTokensWarning() {
  const { fromToken, toToken } = useQuoteStore();
  const showWarningMessage =
    !!fromToken && !!toToken && areTokensEqual(fromToken, toToken);

  return showWarningMessage ? (
    <Container>
      <Divider size={10} />
      <NoRouteIcon size={24} color="gray" />
      <Divider size={4} />
      <Typography variant="title" size={'small'}>
        {i18n.t('No Routes Found')}
      </Typography>
      <Divider size={4} />
      <Alert
        title={i18n.t('You cannot use the same token for From and To.')}
        type={'warning'}
        variant="alarm"
      />
    </Container>
  ) : null;
}
