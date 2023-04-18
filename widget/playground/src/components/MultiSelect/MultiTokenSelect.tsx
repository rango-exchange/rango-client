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
import { Asset, BlockchainMeta, Token } from 'rango-sdk';
import { Type } from '../../types';
import { useConfigStore } from '../../store/config';
import { Container } from './Container';
import { tokensAreEqual } from '../../helpers';

type PropTypes = {
  list: Token[];
  blockchains: BlockchainMeta[];
  label: string;
  modalTitle: string;
  type: Type;
};
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
export function MultiTokenSelect({ label, modalTitle, list, blockchains, type }: PropTypes) {
  const [open, setOpen] = useState(false);
  const [chain, setChain] = useState<string>('');
  const [selectTokens, setSelectTokens] = useState({});
  const fromTokens = useConfigStore.use.config().from.tokens;
  const toTokens = useConfigStore.use.config().to.tokens;
  const onChangeTokens = useConfigStore.use.onChangeTokens();
  const tokens = type === 'Source' ? fromTokens : toTokens;

  const onChangeSelectList = (token: Asset) => {
    const select = { ...selectTokens };
    if (select[chain]) {
      const index = select[chain].findIndex((item) => tokensAreEqual(item, token));
      if (index === -1) {
        select[chain].push(token);
      } else {
        select[chain].splice(index, 1);
      }
    } else {
      select[chain] = [
        {
          blockchain: token.blockchain,
          address: token.address,
          symbol: token.symbol,
        },
      ];
    }

    let values = !!tokens ? [...tokens] : [];
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
    let values = !!tokens ? [...tokens] : [];
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
    if (!!tokens && (!tokens.length || tokens.length === list.length)) {
      onChangeTokens(undefined, type);
    }
    setOpen(false);
  };
  return (
    <div>
      <Container label={label} onOpenModal={() => setOpen(true)}>
        {!!tokens && tokens.length ? (
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
              label={!tokens.length ? 'None Selected' : '...'}
              onClick={() => setOpen(true)}
            />
          </>
        ) : (
          <Chip style={{ margin: 2 }} selected label="All Tokens" />
        )}
      </Container>

      <Modal
        action={
          <Checkbox
            onCheckedChange={(checked) => {
              if (checked) {
                setChain('');
                onChangeTokens(undefined, type);
              } else {
                onChangeTokens([], type);
                setChain(blockchains[0].name);
              }
            }}
            id="all_Tokens"
            label="Select All Tokens"
            checked={!tokens}
          />
        }
        open={open}
        onClose={onClose}
        content={
          <SecondaryPage
            textField={true}
            hasHeader={false}
            textFieldPlaceholder="Search Token By Name">
            {(searchedFor) => {
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
                          disabled={!tokens}
                          type={chain === blockchain.name ? 'primary' : undefined}
                          variant="outlined"
                          onClick={() => setChain(blockchain.name)}>
                          {blockchain.name}
                        </Button>
                      </>
                    ))}
                  </Row>
                  <Spacer direction="vertical" />

                  {!tokens ? (
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
                        onChange={(token) =>
                          onChangeSelectList({
                            blockchain: token.blockchain,
                            address: token.address,
                            symbol: token.symbol,
                          })
                        }
                      />
                    </Content>
                  )}
                </>
              );
            }}
          </SecondaryPage>
        }
        title={modalTitle}
        containerStyle={{ width: '560px', maxHeight: '775px', minHeight: '665px' }}
      />
    </div>
  );
}
