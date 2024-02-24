import type { PreferenceType } from 'rango-sdk';

import { Select } from '@rango-dev/ui';
import React from 'react';

import { ROUTE_STRATEGY } from '../../constants/quote';
import { useQuoteStore } from '../../store/quote';

import { SelectContainer } from './Quotes.styles';

export function SelectStrategy(props: { container: HTMLElement }) {
  const { updateQuotePartialState, sortStrategy } = useQuoteStore();

  return (
    <SelectContainer>
      <Select
        container={props.container}
        options={ROUTE_STRATEGY}
        value={
          ROUTE_STRATEGY.find(
            (strategy) => strategy.value === sortStrategy
          ) as {
            value: PreferenceType;
            label: string;
          }
        }
        handleItemClick={(item) => {
          updateQuotePartialState('sortStrategy', item.value as PreferenceType);
        }}
      />
    </SelectContainer>
  );
}
