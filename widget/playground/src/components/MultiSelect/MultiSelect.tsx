import type {
  MuliSelectPropTypes,
  MultiSelectChipProps,
} from './MultiSelect.types';

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
import { TokensPanel } from '../TokensPanel';

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

export function MultiSelect(props: MuliSelectPropTypes) {
  const [showNextModal, setShowNextModal] = useState(false);
  const { label, type, value, list } = props;
  const valueAll = !value;
  const noneSelected = !valueAll && !value.length;
  const hasValue = !valueAll;
  const showMore = hasValue && value.length > MAX_CHIPS;
  const onBack = () => setShowNextModal(false);

  return (
    <>
      <Label>
        {props.icon}
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
          {type !== 'Tokens' ? (
            <MultiList
              defaultSelectedItems={props.defaultSelectedItems}
              type={type}
              list={list}
              showCategory={type === 'Blockchains' || type === 'Wallets'}
              icon={
                type === 'Wallets' ? (
                  <WalletIcon size={18} />
                ) : (
                  <ChainsIcon size={24} />
                )
              }
              onChange={(items) => {
                props.onChange(items);
                onBack();
              }}
              label={`Supported ${type}`}
            />
          ) : (
            <TokensPanel
              list={list}
              onChange={(items) => {
                props.onChange(items);
                onBack();
              }}
              selectedBlockchains={props.selectedBlockchains}
            />
          )}
        </OverlayPanel>
      )}
    </>
  );
}
