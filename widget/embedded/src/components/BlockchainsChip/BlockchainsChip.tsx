import type { PropTypes } from './BlockchainsChip.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Chip } from './BlockchainsChip.styles';

export function BlockchainsChip(props: PropsWithChildren<PropTypes>) {
  const { children, selected, onClick } = props;
  return (
    <Chip selected={selected} onClick={onClick}>
      {children}
    </Chip>
  );
}
