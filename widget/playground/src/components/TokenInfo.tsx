import React, { useState } from 'react';
import {
  AngleDownIcon,
  BlockchainSelector,
  Button,
  InfoCircleIcon,
  Modal,
  styled,
  TextField,
  TokenSelector,
} from '@rango-dev/ui';
import { useMetaStore } from '../store/meta';
import { useConfigStore } from '../store/config';
import { Type } from '../types';

interface PropTypes {
  type: Type;
}

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$neutrals300',
  borderRadius: '99999px',
});
const StyledImage = styled('img', {
  width: '24px',
});
const Container = styled('div', {
  display: 'grid',
  position: 'relative',
  gap: 12,
  gridTemplateColumns: '1fr',
  '@md': {
    gridTemplateColumns: '1fr 1fr',
  },
  '@lg': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
});
const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$14',
  marginBottom: '$4',
  color: '$foreground',
});

export function TokenInfo({ type }: PropTypes) {
  const toChain = useConfigStore.use.configs().toChain;
  const fromChain = useConfigStore.use.configs().fromChain;
  const toToken = useConfigStore.use.configs().toToken;
  const fromToken = useConfigStore.use.configs().fromToken;
  const fromAmount = useConfigStore.use.configs().fromAmount;
  const toChains = useConfigStore.use.configs().toChains;

  const fromChains = useConfigStore.use.configs().fromChains;
  const toTokens = useConfigStore.use.configs().toTokens;
  const fromTokens = useConfigStore.use.configs().fromTokens;

  const onChangeNumbersConfig = useConfigStore.use.onChangeNumbersConfig();
  const onChangeBlockChain = useConfigStore.use.onChangeBlockChain();
  const onChangeToken = useConfigStore.use.onChangeToken();

  const token = type === 'Source' ? fromToken : toToken;
  const chain = type === 'Source' ? fromChain : toChain;

  const [modal, setModal] = useState({ open: false, isChain: false, isToken: false });
  const loadingStatus = useMetaStore.use.loadingStatus();
  const blockchains = useMetaStore.use.meta().blockchains;
  const tokens = useMetaStore.use.meta().tokens;

  const supportedChains = type === 'Source' ? fromChains : toChains;
  const supportedTokens = type == 'Source' ? fromTokens : toTokens;

  const ItemSuffix = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
      <AngleDownIcon />
    </div>
  );

  return (
    <Container>
      <div>
        <Label>Default Blockchains</Label>

        <Button
          variant="outlined"
          onClick={() =>
            setModal((prev) => ({
              open: !prev.open,
              isChain: true,
              isToken: false,
            }))
          }
          disabled={loadingStatus === 'failed'}
          loading={loadingStatus === 'loading'}
          prefix={
            loadingStatus === 'success' && chain ? (
              <StyledImage src={chain.logo} />
            ) : (
              <ImagePlaceholder />
            )
          }
          suffix={ItemSuffix}
          fullWidth
          align="start"
          size="large">
          {chain ? chain.displayName : 'Chain'}
        </Button>
      </div>

      <div>
        <Label>Default Token</Label>
        <Button
          variant="outlined"
          disabled={loadingStatus === 'failed' || !chain}
          loading={loadingStatus === 'loading'}
          prefix={
            loadingStatus === 'success' && token ? (
              <StyledImage src={token.image} />
            ) : (
              <ImagePlaceholder />
            )
          }
          suffix={ItemSuffix}
          fullWidth
          onClick={() =>
            setModal((prev) => ({
              open: !prev.open,
              isChain: false,
              isToken: true,
            }))
          }
          align="start"
          size="large">
          {token ? token.symbol : 'Token'}
        </Button>
      </div>

      {type !== 'Destination' ? (
        <div>
          <TextField
            onChange={(e) => onChangeNumbersConfig('fromAmount', parseInt(e.target.value || '0'))}
            value={fromAmount}
            label="Default Amount"
            type="number"
            size="large"
          />
        </div>
      ) : null}

      <Modal
        open={modal.open}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
        content={
          modal.isChain ? (
            <BlockchainSelector
              list={supportedChains === 'all' ? blockchains : supportedChains}
              hasHeader={false}
              selected={chain}
              onChange={(chain) => {
                onChangeBlockChain(chain, type);
                onChangeToken(null, type);
                setModal((prev) => ({
                  ...prev,
                  open: !prev.open,
                }));
                

              }}
              loadingStatus={loadingStatus}
            />
          ) : (
            modal.isToken && (
              <TokenSelector
                list={(supportedTokens === 'all' ? tokens : supportedTokens).filter(
                  (token) => token.blockchain === chain?.name,
                )}
                hasHeader={false}
                selected={token}
                onChange={(token) => {
                  setModal((prev) => ({
                    ...prev,
                    open: !prev.open,
                  }));
                  onChangeToken(token, type);
                }}
              />
            )
          )
        }
        title={`Select ${type} Network`}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </Container>
  );
}
