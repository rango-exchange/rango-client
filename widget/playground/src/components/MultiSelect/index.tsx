import React, { useState } from 'react';
import {
  BlockchainSelector,
  Button,
  Chip,
  CloseIcon,
  Modal,
} from '@rango-dev/ui';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
import { Wallets } from '../../types';
import { WalletType } from '@rango-dev/wallets-shared';
import { BlockchainMeta } from 'rango-sdk';
import { useMetaStore } from '../../store/meta';
import { Container } from './Container';
import ModalContent from './ModalContent';

type PropTypes = (
  | {
      type: 'Blockchains';
      value?: string[];
      list: BlockchainMeta[];
      onChange: (chain: string | 'all' | 'empty') => void;
    }
  | {
      type: 'Wallets';
      value?: WalletType[];
      list: Wallets;
      onChange: (wallet: WalletType | 'all' | 'empty') => void;
    }
  | {
      type: 'Sources';
      value?: string[];
      list: LiquiditySource[];
      onChange: (source: string | 'all' | 'empty') => void;
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
  const { blockchains } = useMetaStore.use.meta();

  const onClickAction = () => {
    if (!value) onChange('empty');
    else onChange('all');
  };

  const onClose = () => {
    if (!value || !value.length) onChange('all');
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
            selectedList={
              !value
                ? 'all'
                : blockchains.filter((chain) => value.includes(chain.name))
            }
            onChange={(blockchain) => onChange(blockchain.name)}
            loadingStatus={loadingStatus}
          />
        );
      case 'Sources':
        return (
          <ModalContent
            list={list}
            onChange={(item) => onChange(item.title)}
            selectedList={value}
            type={type}
          />
        );
      case 'Wallets':
        return (
          <ModalContent
            list={list}
            onChange={(item) => onChange(item.type)}
            selectedList={value}
            type={type}
          />
        );
    }
  };

  return (
    <div>
      <Container label={label} onOpenModal={() => setOpen(true)}>
        {!value ? (
          <Chip style={{ margin: 2 }} selected label={`All ${type}`} />
        ) : !value.length ? (
          <Chip style={{ margin: 2 }} selected label="None Selected" />
        ) : (
          value.map((v, index) => (
            <Chip
              style={{ margin: 2 }}
              selected
              label={v}
              suffix={<CloseIcon color="white" />}
              onClick={() => onChange(v)}
              key={index}
            />
          ))
        )}
      </Container>

      <Modal
        action={
          <Button type="primary" variant="ghost" onClick={onClickAction}>
            {!value ? 'Deselect All' : 'Select All'}
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
