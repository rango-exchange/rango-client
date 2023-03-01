import React, { useState } from 'react';
import {
  BlockchainSelector,
  Button,
  Chip,
  Close,
  FilledCircle,
  Modal,
  SecondaryPage,
  Spacer,
  styled,
  TokenSelector,
  Typography,
} from '@rangodev/ui';
import { BlockchainMeta, LiquiditySource, TokenMeta } from '@rangodev/ui/dist/types/meta';
import { containsText } from '../../helpers';
import { Wallets } from '../../types/config';
import { WalletType } from '@rangodev/wallets-shared';

interface PropTypes {
  label: string;
  type: 'Blockchains' | 'Tokens' | 'Wallests' | 'Sources';
  modalTitle: string;
  list: BlockchainMeta[] | TokenMeta[] | LiquiditySource[] | Wallets;
  value: string[];
  onChange: (name: string, value: string[] | WalletType[] | any) => void;
  name: string;
}

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
});

const filterList = (list, searchedFor: string) =>
  list.filter((item) => containsText(item.title, searchedFor));
const Image = styled('img', {
  width: '1.5rem',
  maxHeight: '1.5rem',
  marginRight: '$4',
});

function RenderSelectors({ type, list, selectedList, onChangeSelected }) {
  const isSelect = (name: string) => {
    if (!selectedList?.length) return true;
    else if (selectedList.indexOf(name) !== -1) return true;
    return false;
  };
  return (
    <SecondaryPage
      textField={true}
      hasHeader={false}
      inModal
      textFieldPlaceholder={`Search ${type} By Name`}
      Content={({ searchedFor }) => (
        <ListContainer>
          {filterList(list, searchedFor).map((item, index) => (
            <Button
              type={isSelect(type === 'Wallests' ? item.type : item.title) ? 'primary' : undefined}
              variant="outlined"
              size="large"
              prefix={<Image src={item.logo} />}
              suffix={
                isSelect(type === 'Wallests' ? item.type : item.title) ? (
                  <FilledCircle />
                ) : undefined
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

export function MultiSelect({ label, type, modalTitle, list, value, onChange, name }: PropTypes) {
  const [open, setOpen] = useState<boolean>(false);

  const onChangeSelectList = (v, key) => {
    if (!value.length) {
      const values = list.map((item) => item[key]);
      const index = values.findIndex((item) => item === v[key]);
      values.splice(index, 1);
      console.log(values);

      onChange(name, values);
    } else {
      let values = value;

      const index = value.findIndex((value) => value === v[key]);
      if (index !== -1) values.splice(index, 1);
      else {
        values = [...value, v[key]];
      }
      if (values.length === list.length) onChange(name, []);
      else onChange(name, values);
    }
  };

  const onClickChip = (v: string) => {
    const values = value;

    const index = value.findIndex((value) => value === v);
    values.splice(index, 1);
    onChange(name, values);
  };

  const renderModalContent = () => {
    switch (type) {
      case 'Blockchains':
        return (
          <BlockchainSelector
            list={list as BlockchainMeta[]}
            inModal
            hasHeader={false}
            multiSelect
            selectedList={value}
            onChange={(chain) => onChangeSelectList(chain, 'name')}
          />
        );
      case 'Tokens':
        return (
          <TokenSelector
            list={list as TokenMeta[]}
            inModal
            multiSelect
            hasHeader={false}
            selectedList={value}
            onChange={(token) => onChangeSelectList(token, 'symbol')}
          />
        );

      case 'Wallests':
        return (
          <RenderSelectors
            list={list}
            onChangeSelected={(item) => onChangeSelectList(item, 'type')}
            selectedList={value}
            type={type}
          />
        );
      case 'Sources':
        return (
          <RenderSelectors
            list={list}
            onChangeSelected={(item) => onChangeSelectList(item, 'title')}
            selectedList={value}
            type={type}
          />
        );
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
          style={{ width: 70 }}
          fullWidth
          size="small"
          type="primary">
          Change
        </Button>
      </Head>
      <Spacer size={16} scale="vertical" />
      <Body>
        {!value?.length ? (
          <Chip style={{ margin: 2 }} selected label={`All ${type}`} />
        ) : (
          value.map((v) => (
            <Chip
              style={{ margin: 2 }}
              selected
              label={v}
              suffix={<Close />}
              onClick={() => onClickChip(v)}
            />
          ))
        )}
      </Body>
      <Modal
        open={open}
        onClose={() => setOpen((prev) => !prev)}
        content={renderModalContent()}
        title={modalTitle}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </div>
  );
}
