import type { ChangeEvent } from 'react';

import { Divider, TextField, Typography } from '@rango-dev/ui';
import React from 'react';

import { useConfigStore } from '../../store/config';
import { DefaultChainAndToken } from '../DefaultChainAndToken';
import { SupportedBlockchains } from '../SupportedBlockchains';

import { FromAmount, FromToContainer } from './FunctionalLayout.styles';

export function FromSection() {
  const {
    config: { amount },
    onChangeAmount,
  } = useConfigStore();

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeAmount(parseFloat(e.target.value || '0'));
  };

  return (
    <>
      <SupportedBlockchains type="Source" />
      <Divider size={12} />

      <FromToContainer>
        <DefaultChainAndToken type="Source" />
        <Divider size={12} />
        <Typography size="medium" variant="body">
          Amount
        </Typography>
        <Divider size={4} />
        <FromAmount>
          <TextField
            onChange={handleChangeAmount}
            placeholder="0"
            value={amount ?? ''}
          />
        </FromAmount>
      </FromToContainer>
    </>
  );
}
