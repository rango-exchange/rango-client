import type { MultiSelectChipProps, PropTypes } from './MultiSelect.types';

import { ChevronRightIcon, Divider, Typography } from '@rango-dev/ui';
import React from 'react';

import { Label, Select, WalletChip } from './MultiSelect.styles';

const MAX_CHIPS = 4;
const Chip = (props: MultiSelectChipProps) => {
  const { label, variant = 'contained' } = props;
  return (
    <WalletChip variant={variant}>
      <Typography size="small" variant="label" color="secondary500">
        {label}
      </Typography>
    </WalletChip>
  );
};

export function MultiSelect(props: PropTypes) {
  const { label, type, value, onClick, icon } = props;
  const valueAll = !value;
  const noneSelected = !valueAll && !value.length;
  const hasValue = !valueAll;
  const showMore = hasValue && value.length > MAX_CHIPS;

  return (
    <>
      <Label>
        {icon}
        <Divider direction="horizontal" size={4} />
        <Typography size="medium" variant="body">
          {label}
        </Typography>
      </Label>
      <Divider size={4} />
      <Select>
        <div className="field" onClick={onClick}>
          <div className="chips">
            {valueAll && <Chip label={`All ${type}`} />}
            {noneSelected && <Chip label="None Selected" />}
            {hasValue &&
              value.slice(0, MAX_CHIPS).map((v) => <Chip key={v} label={v} />)}
            {showMore && (
              <Chip label={`+${value.length - MAX_CHIPS}`} variant="outlined" />
            )}
          </div>
          <ChevronRightIcon size={12} />
        </div>
      </Select>
    </>
  );
}
