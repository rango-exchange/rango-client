import React from 'react';
import { AngleDownIcon, Button, InfoCircleIcon, styled, TextField, Typography } from '@rango-dev/ui';
import { useMetaStore } from '../store/meta';
import { BlockchainMeta, Token } from 'rango-sdk';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { numberToString } from '../utils/numbers';
import BigNumber from 'bignumber.js';
import { getBalanceFromWallet } from '../utils/wallets';
import { useWalletsStore } from '../store/wallets';

type PropTypes = (
  | { type: 'From'; inputAmount: string; onAmountChange: (amount: string) => void }
  | {
      type: 'To';
      outputAmount: BigNumber | null;
      outputUsdValue: BigNumber | null;
    }
) & { chain: BlockchainMeta | null; token: Token | null };

const Box = styled('div', {
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
  width: '$24',
  maxHeight: '$24',
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
  const loadingStatus = useMetaStore.use.loadingStatus();
  const fromChain = useBestRouteStore.use.fromChain();
  const toChain = useBestRouteStore.use.toChain();
  const inputUsdValue = useBestRouteStore.use.inputUsdValue();
  const fromToken = useBestRouteStore.use.fromToken();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const balances = useWalletsStore.use.balances();
  const navigate = useNavigate();

  const tokenBalance =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(balances, fromChain?.name, fromToken?.symbol, fromToken?.address)
            ?.amount || '0',
          8,
        )
      : '0';

  const tokenBalanceReal =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(balances, fromChain?.name, fromToken?.symbol, fromToken?.address)
            ?.amount || '0',
          getBalanceFromWallet(balances, fromChain?.name, fromToken?.symbol, fromToken?.address)
            ?.decimal,
        )
      : '0';

  const ItemSuffix = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
      <AngleDownIcon />
    </div>
  );

  return (
    <Box>
      <div>
        <Typography variant="body2">{type}</Typography>
      </div>
      <Container>
        {props.type === 'From' && (
          <Options>
            <div
              className="balance"
              onClick={() => {
                if (tokenBalance !== '0') setInputAmount(tokenBalanceReal.split(',').join(''));
              }}>
              <Button variant="ghost" size="small">
                <Typography variant="body2">{`Max: ${tokenBalance} ${
                  fromToken?.symbol || ''
                }`}</Typography>
              </Button>
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
            suffix={ItemSuffix}
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
            suffix={ItemSuffix}
            size="large"
            align="start"
            style={{ marginRight: '.5rem' }}>
            {loadingStatus === 'success' && token ? token.symbol : 'Token'}
          </Button>
          {props.type === 'From' ? (
            <TextField
              type="number"
              size="large"
              autoFocus
              placeholder="0"
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
              value={props.inputAmount || ''}
              onChange={
                props.type === 'From'
                  ? (event) => {
                      props.onAmountChange(event.target.value);
                    }
                  : undefined
              }
            />
          ) : (
            <OutputContainer>
              <Typography variant="body1">
                {bestRoute ? `≈ ${numberToString(props.outputAmount)}` : inputAmount ? '?' : '0'}
              </Typography>
              <span style={{ position: 'absolute', right: '4px', bottom: '2px' }}>
                <Typography variant="caption">{`$${numberToString(
                  props.outputUsdValue,
                )}`}</Typography>
              </span>
            </OutputContainer>
          )}
        </div>
      </Container>
    </Box>
  );
}
