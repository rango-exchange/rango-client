import React from 'react';
import {
  AngleDownIcon,
  Button,
  InfoCircleIcon,
  styled,
  TextField,
  Typography,
  Image,
  Divider,
  PercentageChange,
  ConnectedWallet,
} from '../..';
import { BestRouteResponse, BlockchainMeta, Token } from 'rango-sdk';
import { Trans } from '@lingui/react';
import { i18n } from '@lingui/core';
import { TokenWithBalance } from '../../types/meta';

type PropTypes = (
  | {
      type: 'From';
      onAmountChange: (amount: string) => void;
    }
  | {
      type: 'To';
      outputAmount: string;
      outputUsdValue: string;
      percentageChange: string;
      showPercentageChange: boolean;
    }
) & {
  chain: BlockchainMeta | null;
  token: Token | null;
  loadingStatus: 'loading' | 'success' | 'failed';
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
  inputUsdValue: string;
  fromToken: TokenWithBalance | null;
  setInputAmount: (amount: string) => void;
  connectedWallets: ConnectedWallet[];
  inputAmount: string;
  bestRoute: BestRouteResponse | null;
  fetchingBestRoute: boolean;
  onChainClick: () => void;
  onTokenClick: () => void;
  tokenBalanceReal: string;
  tokenBalance: string;
};

const Box = styled('div', {
  display: 'flex',
  width: '350px',
  height: '101px',
  padding: '15px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '5px',
  flexShrink: 0,
  borderRadius: '15px',
  background: 'var(--surfaces-on-widget, #F9F9F9)',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  borderRadius: '$xs',
  padding: '$8 $16 $16 $16',

  variants: {
    type: {
      filled: {
        backgroundColor: '$neutral100',
      },
      outlined: {
        border: '1px solid $neutral100',
        backgroundColor: '$surface',
      },
    },
  },

  defaultVariants: {
    type: 'filled',
  },

  '.head': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '32px',
  },
  '.form': {
    display: 'flex',
    width: '100%',
    padding: '$2 0',
    '.selectors': {
      width: '35%',

      '._text': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    '.amount': {
      width: '30%',
    },
  },
  '.output-usd': {
    display: 'flex',
    div: {
      display: 'flex',
      paddingLeft: '$8',
    },
  },
});

const Options = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',

  '.balance': {
    display: 'flex',
    alignItems: 'center',
  },
});

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$neutral100',
  borderRadius: '99999px',
});

const OutputContainer = styled('div', {
  windth: '100%',
  height: '$48',
  borderRadius: '$xs',
  backgroundColor: '$surface',
  border: '1px solid transparent',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '$8',
  paddingRight: '$8',
});

export function TokenInfo(props: PropTypes) {
  const {
    type,
    chain,
    token,
    loadingStatus,
    fromChain,
    toChain,
    fromToken,
    setInputAmount,
    inputUsdValue,
    inputAmount,
    bestRoute,
    fetchingBestRoute,
    onChainClick,
    onTokenClick,
    tokenBalanceReal,
    tokenBalance,
  } = props;

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

  let y = 1;
  y = 2;

  return (
    <Box>
      <div
        style={{
          display: 'flex',
          height: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: '0',
          alignSelf: 'stretch',
        }}>
        <Typography variant="body" size="small" color="$neutral400">
          From
        </Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '5px',
            alignSelf: 'stretch',
          }}>
          <Typography variant="body" size="xsmall" color="$neutral400">
            Balance: 0.087
          </Typography>
        </div>
      </div>
      <Divider direction="horizontal" size={4} />
      <div
        style={{
          display: 'flex',
          height: '50px',
          alignItems: 'center',
          gap: '170px',
          flexShrink: '0',
          alignSelf: 'stretch',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: '1 0 0',
            alignSelf: 'stretch',
          }}>
          <div
            style={{
              display: 'flex',
              width: '180px',
              padding: '2px 5px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '10px',
              alignSelf: 'stretch',
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                alignSelf: 'stretch',
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '-35px',
                  alignSelf: 'stretch',
                }}>
                <div
                  style={{
                    display: 'flex',
                    width: '35px',
                    height: '35px',
                    alignItems: 'flex-start',
                    gap: '-10px',
                  }}></div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: '1 0 0',
                }}>
                <Typography variant="title" size="medium">
                  DAI
                </Typography>
                <Typography variant="body" size="medium" color="$neutral400">
                  Ethereum
                </Typography>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              width: '140px',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '10px',
              alignSelf: 'stretch',
            }}></div>
        </div>
      </div>
      <Container type={props.type === 'From' ? 'filled' : 'outlined'}>
        <div className="head">
          <Typography variant="body" size="small" color="neutral800">
            {type === 'From' ? (
              <Trans id="swap from" message="From" />
            ) : (
              <Trans id="swap to" message="To" />
            )}
          </Typography>
          {props.type === 'From' ? (
            y === 5 ? (
              <Options>
                <div
                  className="balance"
                  onClick={() => {
                    if (tokenBalance !== '0')
                      setInputAmount(tokenBalanceReal.split(',').join(''));
                  }}>
                  <Typography variant="body" size="small" color="neutral600">
                    {i18n.t('Balance')}: {tokenBalance}{' '}
                    {fromToken?.symbol || ''}
                  </Typography>
                  <Divider size={4} />
                  <Button type="primary" variant="ghost" size="compact">
                    <Trans id="maximum amount of asset" message="Max" />
                  </Button>
                </div>
              </Options>
            ) : null
          ) : (
            <div className="output-usd">
              <PercentageChange
                percentageChange={props.percentageChange}
                showPercentageChange={props.showPercentageChange}
              />
              <div>
                <Typography
 variant="body"
 size="xsmall"                  color="neutral600">{`$${props.outputUsdValue}`}</Typography>
              </div>
            </div>
          )}
        </div>
        <div className="form">
          {y === 5 && (
            <Button
              className="selectors"
              onClick={() => {
                navigate(`${props.type.toLowerCase()}-chain`);
              }}
              variant="outlined"
              disabled={loadingStatus === 'failed'}
              loading={loadingStatus === 'loading'}
              prefix={
                loadingStatus === 'success' && chain ? (
                  <Image src={chain.logo} size={24} />
                ) : (
                  <ImagePlaceholder />
                )
              }
              suffix={ItemSuffix}
              align="start"
              size="large">
              {loadingStatus === 'success' && chain
                ? chain.displayName
                : i18n.t('Chaiddddddddddddddddn')}
            </Button>
          )}
          <Divider size={12} direction="horizontal" />
          <Button
            className="selectors"
            onClick={onTokenClick}
            variant="outlined"
            disabled={
              loadingStatus === 'failed' ||
              (type === 'From' && !fromChain) ||
              (type === 'To' && !toChain)
            }
            loading={loadingStatus === 'loading'}
            prefix={
              loadingStatus === 'success' && token ? (
                <Image src={token.image} size={24} />
              ) : (
                <ImagePlaceholder />
              )
            }
            suffix={ItemSuffix}
            size="large"
            align="start">
            {loadingStatus === 'success' && token
              ? token.symbol
              : i18n.t('Token')}
          </Button>
          <Divider size={12} direction="horizontal" />
          <div className="amount">
            {type === 'From' ? (
              <TextField
                type="number"
                size="large"
                autoFocus
                placeholder="0"
                style={{
                  position: 'relative',
                  backgroundColor: '$background !important',
                }}
                suffix={
                  <span
                    style={{
                      position: 'absolute',
                      right: '4px',
                      bottom: '2px',
                    }}>
                    <Typography
 variant="body"
 size="xsmall"                      color="neutral800">{`$${inputUsdValue}`}</Typography>
                  </span>
                }
                value={inputAmount || ''}
                min={0}
                onChange={
                  type === 'From'
                    ? (event) => {
                        props.onAmountChange(event.target.value);
                      }
                    : undefined
                }
              />
            ) : (
              <OutputContainer>
                <Typography variant="title" size="medium">
                  {fetchingBestRoute && '?'}
                  {!!bestRoute?.result && `≈ ${props.outputAmount}`}
                  {(!inputAmount || inputAmount === '0') && '0'}
                </Typography>
              </OutputContainer>
            )}
          </div>
        </div>
      </Container>
    </Box>
  );
}
