import React, { useState } from 'react';
import { BlockchainSelector, Button, Chip, CloseIcon, Modal } from '@rango-dev/ui';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
import { Source, Wallets } from '../../types';
import { WalletType } from '@rango-dev/wallets-shared';
import { BlockchainMeta } from 'rango-sdk';
import { useMetaStore } from '../../store/meta';
import { Container } from './Container';
import ModalContent from './ModalContent';

type PropTypes = (
  | {
      type: 'Blockchains';
      value: BlockchainMeta[] | 'all';
      list: BlockchainMeta[];
      onChange: (chain: BlockchainMeta | 'all' | 'empty') => void;
    }
  | {
      type: 'Wallets';
      value: WalletType[] | 'all';
      list: Wallets;
      onChange: (wallet: WalletType | 'all' | 'empty') => void;
    }
  | {
      type: 'Sources';
      value: Source[] | 'all';
      list: LiquiditySource[];
      onChange: (source: Source | 'all' | 'empty') => void;
    }
) & {
  label: string;
  modalTitle: string;
};

export function MultiSelect({
  label,
  type,
  modalTitle,
  list,
  value,
  onChange,
}: PropTypes) {
  const [open, setOpen] = useState<boolean>(false);
  const loadingStatus = useMetaStore.use.loadingStatus();

  const onClickAction = () => {
    if (value === 'all') onChange('empty');
    else onChange('all');
  };

  const onClose = () => {
    if (value !== 'all' && !value.length) onChange('all');
    setOpen(false);
  };
  const renderModalContent = () => {
    switch (type) {
      case 'Blockchains':
        return (
          <BlockchainSelector
            list={list}
            hasHeader={false}
            multiSelect
            selectedList={value}
            onChange={onChange}
            loadingStatus={loadingStatus}
          />
        );
      case 'Sources':
        return (
          <ModalContent
            list={list}
            onChange={(item) => onChange(item)}
            selectedList={value}
            type={type}
          />
        );
      case 'Wallets':
        return (
          <ModalContent
            list={list}
            onChange={(item) => onChange(item)}
            selectedList={value}
            type={type}
          />
        );
    }
  };

  const getLabel = (value) => {
    switch (type) {
      case 'Blockchains':
        return value.name;
      case 'Wallets':
        return value;
      case 'Sources':
        return value.title;
    }
  };
  return (
    <div>
      <Container label={label} onOpenModal={() => setOpen(true)}>
        {value === 'all' ? (
          <Chip style={{ margin: 2 }} selected label={`All ${type}`} />
        ) : !value.length ? (
          <Chip style={{ margin: 2 }} selected label="None Selected" />
        ) : (
          value.map((v) => (
            <Chip
              style={{ margin: 2 }}
              selected
              label={getLabel(v)}
              suffix={<CloseIcon />}
              onClick={() => onChange(v)}
            />
          ))
        )}
      </Container>

      <Modal
        action={
          <Button type="primary" variant="ghost" onClick={onClickAction}>
            {value === 'all' ? 'Deselect All' : 'Select All'}
          </Button>
        }
        open={open}
        onClose={onClose}
        content={renderModalContent()}
        title={modalTitle}
        containerStyle={{ width: '560px', height: '655px' }}
      />
    </div>
  );
}
