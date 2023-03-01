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
import { blockchainMeta, tokensMeta } from './mock';
import { BlockchainMeta, TokenMeta } from '@rangodev/ui/dist/types/meta';
interface PropTypes {
  type: 'from' | 'to';
  chain: BlockchainMeta;
  token: TokenMeta;
  defualtAmount: string;
  onChange: (name: string, value: string | TokenMeta | BlockchainMeta) => void;
}

const Container = styled('div', {
  display: 'grid',
  position: 'relative',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 12,
});

const StyledImage = styled('img', {
  width: '24px',
});

export function TokenInfo({ defualtAmount, type, chain, onChange, token }: PropTypes) {
  const [modal, setModal] = useState({ open: false, isChain: false, isToken: false });

  const onChangeConfig = (name, value) => onChange(name, value);
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
          prefix={<StyledImage src={chain.logo} />}
          suffix={<AngleDownIcon />}
          fullWidth
          align="start"
          size="large">
          {chain.displayName}
        </Button>
      </div>

      <div>
        <Typography mb={4} variant="body2">
          default Token
        </Typography>
        <Button
          variant="outlined"
          prefix={<StyledImage src={token.image} />}
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
          {token.symbol}
        </Button>
      </div>

      {type !== 'from' ? (
        <TextField
          onChange={(e) => onChangeConfig(e.target.name, e.target.value)}
          value={defualtAmount}
          name="fromAmount"
          label="Default Amount"
          type="number"
        />
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
              type={type === 'from' ? 'Source' : 'Destination'}
              list={blockchainMeta}
              inModal={true}
              hasHeader={false}
              selected={chain}
              onChange={(chain) => onChangeConfig(`${type}Chain`, chain)}
            />
          ) : (
            modal.isToken && (
              <TokenSelector
                list={tokensMeta}
                inModal={true}
                hasHeader={false}
                type={type === 'from' ? 'Source' : 'Destination'}
                selected={token}
                onChange={(chain) => onChangeConfig(`${type}Token`, chain)}
              />
            )
          )
        }
        title={`Select ${type === 'from' ? 'Source' : 'Destination'} Network`}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </Container>
  );
}
