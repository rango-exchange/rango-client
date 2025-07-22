import type { PreferenceType } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Select } from '@arlert-dev/ui';
import React from 'react';

import { useQuoteStore } from '../../store/quote';

import { SelectContainer } from './Quotes.styles';

export function SelectStrategy(props: { container: HTMLElement }) {
  const { updateQuotePartialState, sortStrategy } = useQuoteStore();

  const ROUTE_STRATEGY: { value: PreferenceType; label: string }[] = [
    {
      value: 'SMART',
      label: i18n.t('Smart Routing'),
    },
    {
      value: 'FEE',
      label: i18n.t('Lowest Fee'),
    },
    {
      value: 'SPEED',
      label: i18n.t('Fastest Transfer'),
    },
    {
      value: 'NET_OUTPUT',
      label: i18n.t('Maximum Return'),
    },
    {
      value: 'PRICE',
      label: i18n.t('Maximum Output'),
    },
  ];

  return (
    <SelectContainer>
      <Select
        id={'widget-quotes-strategy-select'}
        container={props.container}
        options={ROUTE_STRATEGY}
        value={sortStrategy}
        handleItemClick={(item) => {
          updateQuotePartialState('sortStrategy', item.value);
        }}
        variant="filled"
      />
    </SelectContainer>
  );
}
