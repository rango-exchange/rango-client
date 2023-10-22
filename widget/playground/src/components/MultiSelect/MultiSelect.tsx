import type { MultiSelectChipProps, PropTypes } from './MultiSelect.types';

import {
  ChainsIcon,
  ChevronRightIcon,
  Divider,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { MultiList } from '../MultiList';
import { OverlayPanel } from '../OverlayPanel';

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
  const [showNextModal, setShowNextModal] = useState(false);
  const { label, type, value, onChange, icon, defaultSelectedItems, list } =
    props;
  const valueAll = !value;
  const noneSelected = !valueAll && !value.length;
  const hasValue = !valueAll;
  const showMore = hasValue && value.length > MAX_CHIPS;
  const onBack = () => setShowNextModal(false);

  const handleListChange = (items?: string[]) => {
    onChange(items);
    onBack();
  };

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
        <div className="field" onClick={() => setShowNextModal(true)}>
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
      {showNextModal && (
        <OverlayPanel onBack={onBack}>
          <MultiList
            defaultSelectedItems={defaultSelectedItems}
            type={type}
            list={list}
            icon={
              type === 'Blockchains' ? (
                <ChainsIcon size={24} />
              ) : (
                <WalletIcon size={18} />
              )
            }
            onChange={handleListChange}
            label={`Supported ${type}`}
          />
        </OverlayPanel>
      )}
    </>
  );
}
