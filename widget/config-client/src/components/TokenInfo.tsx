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
} from '@rangodev/ui';
import { useMetaStore } from '../store/meta';
import { Value } from '../types';
import { BlockchainMeta, Token } from 'rango-sdk';

interface PropTypes {
  type: 'from' | 'to';
  chain: BlockchainMeta | null;
  token: Token | null;
  defualtAmount: number;
  onChange: (name: string, value: Value) => void;
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

export function TokenInfo({ defualtAmount, type, chain, onChange, token }: PropTypes) {
  const [modal, setModal] = useState({ open: false, isChain: false, isToken: false });
  const {
    meta: { blockchains, tokens },
    loadingStatus,
  } = useMetaStore();
  const onChangeConfig = (name, value) => {
    onChange(name, value);
  };
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

      {type !== 'from' ? (
        <div>
          <TextField
            onChange={(e) => onChangeConfig(e.target.name, e.target.value)}
            value={defualtAmount}
            name="fromAmount"
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
              inModal={true}
              hasHeader={false}
              selected={chain}
              onChange={(chain) => onChangeConfig(`${type}Chain`, chain)}
              loadingStatus={loadingStatus}
            />
          ) : (
            modal.isToken && (
              <TokenSelector
                list={tokens.filter((token) => token.blockchain === chain?.name)}
                inModal={true}
                hasHeader={false}
                loadingStatus={loadingStatus}
                selected={token}
                onChange={(token) => onChangeConfig(`${type}Token`, token)}
              />
            )
          )
        }
        title={`Select ${type === 'from' ? 'Source' : 'Destination'} Network`}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </Container>
  );
}
