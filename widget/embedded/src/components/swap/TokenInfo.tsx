import React from 'react';
import { AngleDownIcon, Button, styled, TextField, Typography } from '@rangodev/ui';
import { useMetaStore } from '../../store/meta';
import { BlockchainMeta, Token } from 'rango-sdk';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../../store/bestRoute';

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
  width: '100%',
});

const StyledImage = styled('img', {
  width: '24px',
});

const MaxAmount = styled('div', {
  display: 'flex',
  position: 'absolute',
  right: '$16',
  top: '$6',
  cursor: 'pointer',
});

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$neutrals300',
  borderRadius: '99999px',
});

const TokenBalance = styled('div', { position: 'relative', bottom: '2px' });

const OutputContainer = styled('div', {
  height: '$48',
  borderRadius: '$5',
  flexGrow: 1,
  width: '70%',
  backgroundColor: '$background',
  border: '1px solid transparent',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '$8',
  paddingRight: '$8',
});

export function TokenInfo(props: PropTypes) {
  const { type, chain, token } = props;
  const { loadingStatus } = useMetaStore();
  const { fromChain, toChain } = useBestRouteStore();
  const navigate = useNavigate();
  return (
    <Container>
      <div style={{ position: 'absolute', bottom: '100%' }}>
        <Typography variant="body2">{type}</Typography>
      </div>
      {type === 'From' && (
        <MaxAmount onClick={() => {}}>
          <Typography variant="body2">Max:&nbsp;</Typography>
          <TokenBalance>
            <Typography variant="body1">1234</Typography>
          </TokenBalance>
        </MaxAmount>
      )}
      <Button
        onClick={() => {
          navigate(`/${type.toLowerCase()}-chain`);
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
        align="start"
        size="large"
        style={{ marginRight: '.5rem' }}>
        {loadingStatus === 'success' && chain ? chain.name : 'Chain'}
      </Button>
      <Button
        onClick={() => {
          navigate(`/${type.toLowerCase()}-token`);
        }}
        variant="outlined"
        disabled={
          loadingStatus === 'failed' ||
          (type === 'From' && !fromChain) ||
          (type === 'To' && !toChain)
        }
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
        align="start"
        style={{ marginRight: '.5rem' }}>
        {loadingStatus === 'success' && token ? token.symbol : 'Token'}
      </Button>
      {type === 'From' ? (
        <TextField
          type="number"
          size="large"
          disabled={loadingStatus != 'success'}
          style={{ width: '70%', position: 'relative', backgroundColor: '$background !important' }}
          suffix={
            <span style={{ position: 'absolute', right: '4px', bottom: '2px' }}>
              <Typography variant="caption">$0.0</Typography>
            </span>
          }
        />
      ) : (
        <OutputContainer>
          <Typography variant="body1">{'111'}</Typography>
          <span style={{ position: 'absolute', right: '4px', bottom: '2px' }}>
            <Typography variant="caption">$0.0</Typography>
          </span>
        </OutputContainer>
      )}
    </Container>
  );
}
