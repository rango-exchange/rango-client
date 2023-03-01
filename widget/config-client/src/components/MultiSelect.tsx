import React, { useState } from 'react';
import {
  BlockchainSelector,
  Button,
  Chip,
  CloseIcon,
  FilledCircle,
  Modal,
  SecondaryPage,
  Spacer,
  styled,
  Typography,
} from '@rangodev/ui';
import { LiquiditySource } from '@rangodev/ui/dist/types/meta';
import { Wallets } from '../types';
import { WalletType } from '@rangodev/wallets-shared';
import { BlockchainMeta } from 'rango-sdk';
import { useMetaStore } from '../store/meta';

type PropTypes = (
  | {
      type: 'Blockchains';
      value: BlockchainMeta[] | 'all';
      list: BlockchainMeta[];
      onChange: (name: string, value: BlockchainMeta[] | 'all') => void;
    }
  | {
      type: 'Wallests';
      value: WalletType[] | 'all';
      list: Wallets;
      onChange: (name: string, value: WalletType[] | 'all') => void;
    }
  | {
      type: 'Sources';
      value: LiquiditySource[] | 'all';
      list: LiquiditySource[];
      onChange: (name: string, value: LiquiditySource[] | 'all') => void;
    }
) & {
  label: string;
  modalTitle: string;
  name: string;
  loading?: boolean;
  disabled?: boolean;
};

const Head = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Body = styled('div', {
  maxHeight: 150,
  overflow: 'hidden auto',
});
const ListContainer = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
  maxHeight: 480,
});

const filterList = (list, searchedFor: string) =>
  list.filter((item) => item.title.includes(searchedFor));
const Image = styled('img', {
  width: '1.5rem',
  maxHeight: '1.5rem',
  marginRight: '$4',
});

const getIndex = (list, v, type) => {
  switch (type) {
    case 'Blockchains':
      return list.findIndex((item) => item.name === v.name);
    case 'Wallests':
      return list.findIndex((item) => item === v);
    case 'Sources':
      return list.findIndex((item) => item.title === v.title);
  }
};

function RenderSelectors({ type, list, selectedList, onChangeSelected }) {
  const isSelect = (name: string) => {
    if (selectedList === 'all') return true;
    else if (getIndex(selectedList, name, type) !== -1) return true;
    return false;
  };
  return (
    <SecondaryPage
      textField={true}
      hasHeader={false}
      textFieldPlaceholder={`Search ${type} By Name`}
      Content={({ searchedFor }) => (
        <ListContainer>
          {filterList(list, searchedFor).map((item, index) => (
            <Button
              type={isSelect(type === 'Wallests' ? item.type : item) ? 'primary' : undefined}
              variant="outlined"
              size="large"
              prefix={<Image src={item.logo} />}
              suffix={
                isSelect(type === 'Wallests' ? item.type : item) ? <FilledCircle /> : undefined
              }
              align="start"
              onClick={onChangeSelected.bind(null, item)}
              key={index}>
              <Typography variant="body2">{item.title}</Typography>
            </Button>
          ))}
        </ListContainer>
      )}
    />
  );
}

export function MultiSelect({
  label,
  type,
  modalTitle,
  list,
  value,
  onChange,
  name,
  loading,
  disabled,
}: PropTypes) {
  const [open, setOpen] = useState<boolean>(false);
  const { loadingStatus } = useMetaStore();
  const onChangeSelectList = (v) => {
    let values;
    if (value === 'all') {
      values = type === 'Wallests' ? list.map((item) => item.title) : [...list];
      const index = getIndex(values, v, type);
      values.splice(index, 1);
      onChange(name, values);
    } else {
      values = value;
      const index = getIndex(value, v, type);
      if (index !== -1) values.splice(index, 1);
      else values.push(v);
      if (values.length === list.length) onChange(name, 'all');
      else onChange(name, values);
    }
  };

  const onClickChip = (v: string) => {
    const index = getIndex(value, v, type);
    if (value !== 'all') {
      const values = value;
      values.splice(index, 1);
      onChange(name, values as any);
    }
  };

  const onClickAction = () => {
    if (value === 'all') onChange(name, []);
    else onChange(name, 'all');
  };

  const onClose = () => {
    if (value !== 'all' && !value.length) onChange(name, 'all');
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
            onChange={(chain) => onChangeSelectList(chain)}
            loadingStatus={loadingStatus}
          />
        );
      case 'Wallests':
        return (
          <RenderSelectors
            list={list}
            onChangeSelected={(item) => onChangeSelectList(item)}
            selectedList={value}
            type={type}
          />
        );
      case 'Sources':
        return (
          <RenderSelectors
            list={list}
            onChangeSelected={(item) => onChangeSelectList(item)}
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
      case 'Wallests':
        return value;
      case 'Sources':
        return value.title;
    }
  };
  return (
    <div>
      <Head>
        <Typography noWrap variant="h6">
          {label}
        </Typography>

        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          loading={loading}
          disabled={disabled}
          size="small"
          type="primary">
          Change
        </Button>
      </Head>
      <Spacer size={16} scale="vertical" />
      <Body>
        {value === 'all' ? (
          <Chip style={{ margin: 2 }} selected label={`All ${type}`} />
        ) : (
          value.map((v) => (
            <Chip
              style={{ margin: 2 }}
              selected
              label={getLabel(v)}
              suffix={<CloseIcon />}
              onClick={() => onClickChip(v)}
            />
          ))
        )}
      </Body>
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
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </div>
  );
}
