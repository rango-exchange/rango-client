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
} from '@rango-dev/ui';
import { BlockchainMeta, Token } from 'rango-sdk';
import { Type } from '../types';
import { useConfigStore } from '../store/config';

type PropTypes = {
  list: Token[];
  blockchains: BlockchainMeta[];
  label: string;
  modalTitle: string;
  loading?: boolean;
  disabled?: boolean;
  type: Type;
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
  loading,
  blockchains,
  disabled,
  type,
}: PropTypes) {
  const [modal, setModal] = useState({ open: false, isChain: false, isToken: false });
  const [chain, setChain] = useState<string>('all');
  const [selectTokens, setSelectTokens] = useState({});

  const { fromTokens, toTokens, onChangeTokens } = useConfigStore((state) => state);

  const tokens = type === 'Destination' ? fromTokens : toTokens;

  const onChangeSelectList = (token) => {
    const select = { ...selectTokens };
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

    let values = tokens !== 'all' ? [...tokens] : [];
    const index = values.findIndex(
      (item) => item.symbol === token.symbol && item.address === token.address,
    );
    if (index === -1) {
      values.push(token);
    } else {
      values.splice(index, 1);
    }
    setSelectTokens(select);
    onChangeTokens(values, type);
  };

  const onClickSelectAll = (listOfToken) => {
    let values = tokens !== 'all' ? [...tokens] : [];
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
    onChangeTokens(values, type);
  };

  const onClose = () => {
    if (tokens !== 'all' && (!toTokens.length || tokens.length === list.length)) {
      onChangeTokens('all', type);
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
      <Spacer size={16} direction="vertical" />
      <Body>
        {tokens !== 'all' ? (
          <>
            {[...tokens].splice(0, 10).map((v) => (
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
                if (checked) onChangeTokens('all', type);
                else {
                  onChangeTokens([], type);
                  setChain(blockchains[0].name);
                }
              }}
              id="all_Tokens"
              label="Select All Tokens"
              checked={tokens === 'all'}
            />
          )
        }
        open={modal.open}
        onClose={onClose}
        content={
          <SecondaryPage
            textField={true}
            hasHeader={false}
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
                          disabled={tokens === 'all'}
                          type={chain === blockchain.name ? 'primary' : undefined}
                          variant="outlined"
                          onClick={() => setChain(blockchain.name)}>
                          {blockchain.name}
                        </Button>
                      </>
                    ))}
                  </Row>
                  <Spacer direction="vertical" />

                  {tokens === 'all' ? (
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
                        selectedList={tokens}
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
