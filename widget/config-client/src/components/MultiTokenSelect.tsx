import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Modal,
  SecondaryPage,
  Spacer,
  styled,
  TokenList,
  Typography,
} from '@rangodev/ui';
import { Value } from '../types';
import { BlockchainMeta, Token } from 'rango-sdk';

type PropTypes = {
  value: Token[] | 'all';
  list: Token[];
  blockchains: BlockchainMeta[];
  label: string;
  modalTitle: string;
  onChange: (name: string, value: Value) => void;
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

const Row = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  maxHeight: 120,
  overflow: 'auto',
});

const EmptyContent = styled('div', {
  textAlign: 'center',
  marginTop: '20%',
});
const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});
export function MultiTokenSelect({
  label,
  modalTitle,
  list,
  value,
  onChange,
  name,
  loading,
  blockchains,
  disabled,
}: PropTypes) {
  const [modal, setModal] = useState({ open: false, isChain: false, isToken: false });
  const [chain, setChain] = useState<string>('all');
  const [selectTokens, setSelectTokens] = useState({});

  const onChangeSelectList = (token) => {
    const select = selectTokens;
    if (select[chain]) {
      const index = select[chain].findIndex(
        (item) => item.symbol === token.symbol && item.address === token.address,
      );
      if (index === -1) {
        select[chain].push(token);
      } else {
        select[chain].splice(index, 1);
      }
    } else {
      select[chain] = [token];
    }

    let values = value !== 'all' ? value : [];
    const index = values.findIndex(
      (item) => item.symbol === token.symbol && item.address === token.address,
    );
    if (index === -1) {
      values.push(token);
    } else {
      values.splice(index, 1);
    }
    setSelectTokens(select);
    onChange(name, values);
  };

  const onClickSelectAll = (listOfToken) => {
    let values = value !== 'all' ? value : [];
    const select = selectTokens;
    if (selectTokens[chain] && selectTokens[chain].length === listOfToken.length) {
      select[chain] = [];
      for (const item of listOfToken) {
        const index = values.findIndex(
          (v) => v.symbol === item.symbol && v.address === item.address,
        );
        if (index !== -1) values.splice(index, 1);
      }
    } else {
      for (const item of listOfToken) {
        select[chain] = listOfToken;
        const index = values.findIndex(
          (v) => v.symbol === item.symbol && v.address === item.address,
        );
        if (index === -1) values.push(item);
      }
    }
    setSelectTokens(select);

    onChange(name, values);
  };

  const onClose = () => {
    if (value !== 'all' && (!value.length || value.length === list.length)) {
      onChange(name, 'all');
    }
    setModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <div>
      <Head>
        <Typography noWrap variant="h6">
          {label}
        </Typography>

        <Button
          onClick={() =>
            setModal((prev) => ({
              open: !prev.open,
              isChain: false,
              isToken: true,
            }))
          }
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
        {value !== 'all' ? (
          <>
            {[...value].splice(0, 10).map((v) => (
              <Chip
                style={{ margin: 2 }}
                selected
                label={v.symbol + ' ' + '(' + v.blockchain + ')'}
              />
            ))}
            <Chip
              style={{ margin: 2 }}
              selected
              label="..."
              onClick={() =>
                setModal((prev) => ({
                  ...prev,
                  open: true,
                }))
              }
            />
          </>
        ) : (
          <Chip style={{ margin: 2 }} selected label="All Tokens" />
        )}
      </Body>
      <Modal
        action={
          modal.isToken && (
            <Checkbox
              onCheckedChange={(checked) => {
                if (checked) onChange(name, 'all');
                else {
                  onChange(name, []);
                  setChain(blockchains[0].name);
                }
              }}
              id="all_Tokens"
              label="Select All Tokens"
              checked={value === 'all'}
            />
          )
        }
        open={modal.open}
        onClose={onClose}
        content={
          <SecondaryPage
            textField={true}
            hasHeader={false}
            inModal
            textFieldPlaceholder="Search Token By Name"
            Content={({ searchedFor }) => {
              const filterList = list.filter((token) => token.blockchain === chain);

              return (
                <>
                  <Row>
                    {blockchains.map((blockchain) => (
                      <>
                        <Button
                          size="small"
                          style={{
                            fontSize: 14,
                            height: 24,
                            padding: '0 8px',
                            margin: '0 8px 8px 0',
                          }}
                          disabled={value === 'all'}
                          type={chain === blockchain.name ? 'primary' : undefined}
                          variant="outlined"
                          onClick={() => setChain(blockchain.name)}>
                          {blockchain.name}
                        </Button>
                      </>
                    ))}
                  </Row>
                  <Spacer scale="vertical" />

                  {value === 'all' ? (
                    <EmptyContent>
                      <Typography variant="body2">All tokens are selected</Typography>
                    </EmptyContent>
                  ) : (
                    <Content>
                      <Button
                        style={{ alignSelf: 'end' }}
                        type="primary"
                        variant="ghost"
                        onClick={() => onClickSelectAll(filterList)}>
                        {!!selectTokens[chain] && selectTokens[chain].length === filterList.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                      <TokenList
                        searchedText={searchedFor}
                        list={filterList}
                        selectedList={value}
                        multiSelect
                        onChange={(token) => onChangeSelectList(token)}
                      />
                    </Content>
                  )}
                </>
              );
            }}
          />
        }
        title={modalTitle}
        containerStyle={{ width: '560px', maxHeight: '775px', minHeight: '665px' }}></Modal>
    </div>
  );
}
