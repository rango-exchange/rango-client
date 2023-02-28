import React, { useState } from 'react';
import {
  AngleDownIcon,
  BlockchainSelector,
  Button,
  Modal,
  styled,
  TextField,
  TokenSelector,
  Typography,
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
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 12,
});

export function TokenInfo({ type }: PropTypes) {
  const {
    toChain,
    fromChain,
    toToken,
    fromToken,
    fromAmount,
    onChangeNumbersConfig,
    onChangeBlockChain,
    onChangeToken,
  } = useConfigStore((state) => state);
  const token = type === 'Destination' ? fromToken : toToken;
  const chain = type === 'Destination' ? fromChain : toChain;

  const [modal, setModal] = useState({ open: false, isChain: false, isToken: false });
  const {
    meta: { blockchains, tokens },
    loadingStatus,
  } = useMetaStore();
  return (
    <Container>
      <div>
        <Typography mb={4} variant="body2">
          default Blockchains
        </Typography>

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
          suffix={<AngleDownIcon />}
          fullWidth
          align="start"
          size="large">
          {chain ? chain.displayName : 'Chain'}
        </Button>
      </div>

      <div>
        <Typography mb={4} variant="body2">
          default Token
        </Typography>
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
          suffix={<AngleDownIcon />}
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
              list={blockchains}
              hasHeader={false}
              selected={chain}
              onChange={(chain) => onChangeBlockChain(chain, type)}
              loadingStatus={loadingStatus}
            />
          ) : (
            modal.isToken && (
              <TokenSelector
                list={tokens.filter((token) => token.blockchain === chain?.name)}
                hasHeader={false}
                selected={token}
                onChange={(token) => onChangeToken(token, type)}
              />
            )
          )
        }
        title={`Select ${type} Network`}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </Container>
  );
}
