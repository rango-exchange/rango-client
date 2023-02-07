import React from 'react';
import { AngleDownIcon, Button, styled, TextField, Typography } from '@rangodev/ui';
import { useMetaStore } from '../store/meta';
import { BlockchainMeta, Token } from 'rango-sdk';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { numberToString } from '../utils/numbers';

type PropTypes = (
  | { type: 'From'; inputAmount: number | null; onAmountChange: (amount: number) => void }
  | {
      type: 'To';
    }
) & { chain: BlockchainMeta | null; token: Token | null };

const Box = styled('div', {
  padding: '$16',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  backgroundColor: '$neutrals300',
  borderRadius: '$5',
  padding: '$8 0',

  '.form': {
    display: 'flex',
    width: '100%',
    padding: '$8 $16',
  },
});

const StyledImage = styled('img', {
  width: '24px',
});

const Options = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0 $8',
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
  const { fromChain, toChain, inputUsdValue } = useBestRouteStore();
  const navigate = useNavigate();
  return (
    <Box>
      <div>
        <Typography variant="body2">{type}</Typography>
      </div>
      <Container>
        {props.type === 'From' && (
          <Options>
            <div className="balance" onClick={() => {}}>
              <Button variant="ghost" size="small">
                <Typography variant="body2">Max: 123 USD</Typography>
              </Button>
              {/* <Typography variant="body2">Max:&nbsp;</Typography>
              <TokenBalance>
                <Typography variant="body1">1234</Typography>
              </TokenBalance> */}
            </div>
          </Options>
        )}
        <div className="form">
          <Button
            onClick={() => {
              navigate(`/${props.type.toLowerCase()}-chain`);
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
              navigate(`/${props.type.toLowerCase()}-token`);
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
          {props.type === 'From' ? (
            <TextField
              type="number"
              size="large"
              disabled={loadingStatus != 'success'}
              style={{
                width: '70%',
                position: 'relative',
                backgroundColor: '$background !important',
              }}
              suffix={
                <span style={{ position: 'absolute', right: '4px', bottom: '2px' }}>
                  <Typography variant="caption">{`$${numberToString(inputUsdValue)}`}</Typography>
                </span>
              }
              {...(props.type === 'From' && {
                value: props.inputAmount?.toString() || '',
                onChange: (event) => {
                  props.onAmountChange(parseFloat(event.target.value));
                },
              })}
            />
          ) : (
            <OutputContainer>
              <Typography variant="body1">{'111'}</Typography>
              <span style={{ position: 'absolute', right: '4px', bottom: '2px' }}>
                <Typography variant="caption">$0.0</Typography>
              </span>
            </OutputContainer>
          )}
        </div>
      </Container>
    </Box>
  );
}
