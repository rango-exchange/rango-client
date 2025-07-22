import { i18n } from '@lingui/core';
import { Typography } from '@arlert-dev/ui';
import React from 'react';

import { SlippageTooltipContainer } from './Slippage.styles';

export function SlippageTooltipContent() {
  return (
    <SlippageTooltipContainer>
      <Typography variant="label" size="medium" color="neutral700">
        {i18n.t(
          'Your transaction will be reverted if the price changes unfavorably by more than this percentage.'
        )}
        <br />
        <br />
        <b>{i18n.t('Warning')}</b>:&nbsp;
        {i18n.t(
          'This setting is applied to each step (e.g. 1Inch, Thorchain, etc.), meaning only that specific step will be reverted, not the entire route.'
        )}
      </Typography>
    </SlippageTooltipContainer>
  );
}
