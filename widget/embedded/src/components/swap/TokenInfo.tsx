import React from 'react';
import { AngleDownIcon, Button, styled, TextField, Typography } from '@rangodev/ui';
import { useMetaStore } from '../../store/meta';
import { BlockchainMeta, Token } from 'rango-sdk';
import { useNavigate } from 'react-router-dom';

interface PropTypes {
  type: 'From' | 'To';
  chain: BlockchainMeta | null;
  token: Token | null;
}

const Container = styled('div', {
  boxSizing: 'border-box',
  backgroundColor: '$neutrals300',
  padding: '$24 $8 $8 $8',
  borderRadius: '$5',
  display: 'flex',
  margin: '$16 0',
  position: 'relative',
});

const StyledImage = styled('img', {
  width: '24px',
});

const MaxAmount = styled('div', {
  display: 'flex',
  position: 'absolute',
  right: '$16',
  top: '$6',
});

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$neutrals300',
  borderRadius: '99999px',
});

export function TokenInfo(props: PropTypes) {
  const { type, chain, token } = props;
  const loadingStatus = useMetaStore((state) => state.loadingStatus);
  const navigate = useNavigate();
  return (
    <Container>
      <div style={{ position: 'absolute', bottom: '100%' }}>
        <Typography variant="body2">{type}</Typography>
      </div>
      {type === 'From' && (
        <MaxAmount>
          <Typography variant="body2">Max:&nbsp;</Typography>
          <Typography variant="body1">1234</Typography>
        </MaxAmount>
      )}
      <Button
        onClick={() => {
          navigate(`/${type}-chain`);
        }}
        variant="outlined"
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
        size="large"
        style={{ marginRight: '.5rem' }}>
        {loadingStatus === 'success' && chain ? chain.name : 'Chain'}
      </Button>
      <Button
        onClick={() => {
          navigate(`/${type}-token`);
        }}
        variant="outlined"
        disabled={loadingStatus === 'failed'}
        loading={loadingStatus === 'loading'}
        prefix={
          loadingStatus === 'success' && token ? (
            <StyledImage src={token.image} />
          ) : (
            <ImagePlaceholder />
          )
        }
        suffix={<AngleDownIcon />}
        size="large"
        style={{ marginRight: '.5rem' }}>
        {loadingStatus === 'success' && token ? token.symbol : 'Token'}
      </Button>
      <TextField type="number" size="large" disabled={loadingStatus != 'success'} />
    </Container>
  );
}
