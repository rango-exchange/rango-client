import type { PropTypes } from './ChainsChip.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Chip } from './ChainsChip.styles';

export function ChainsChip(props: PropsWithChildren<PropTypes>) {
  const { children, selected, onClick } = props;
  return (
    <Chip selected={selected} onClick={onClick}>
      {children}
    </Chip>
  );
}
