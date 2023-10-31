import type { ConnectedWallet } from '../..';
import type { TokenWithBalance } from '../../types/meta';
import type { BestRouteResponse, BlockchainMeta, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react';
import React from 'react';

import {
  Button,
  Divider,
  Image,
  PercentageChange,
  TextField,
  Typography,
} from '../..';
import { AngleDownIcon, InfoCircleIcon } from '../../components/Icon';
import { styled } from '../../theme';

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
  fromBlockchain: BlockchainMeta | null;
  toBlockchain: BlockchainMeta | null;
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
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  borderRadius: '$xs',
  padding: '$8 $16 $16 $16',

  variants: {
    type: {
      filled: {
        backgroundColor: '$background',
      },
      outlined: {
        border: '1px solid $background',
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
  backgroundColor: '$background',
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
    fromBlockchain,
    toBlockchain,
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

  return (
    <Box>
      <Container type={type === 'From' ? 'filled' : 'outlined'}>
        <div className="head">
          <Typography variant="body" size="small" color="neutral600">
            {type === 'From' ? (
              <Trans id="swap from" message="From" />
            ) : (
              <Trans id="swap to" message="To" />
            )}
          </Typography>
          {type === 'From' ? (
            <Options>
              <div
                className="balance"
                onClick={() => {
                  if (tokenBalance !== '0') {
                    setInputAmount(tokenBalanceReal.split(',').join(''));
                  }
                }}>
                <Typography variant="body" size="small" color="neutral800">
                  {i18n.t('Balance')}: {tokenBalance} {fromToken?.symbol || ''}
                </Typography>
                <Divider size={4} />
                <Button type="primary" variant="ghost" size="small">
                  <Trans id="maximum amount of asset" message="Max" />
                </Button>
              </div>
            </Options>
          ) : (
            <div className="output-usd">
              <PercentageChange
                percentageChange={props.percentageChange}
                showPercentageChange={props.showPercentageChange}
              />
              <div>
                <Typography
                  variant="body"
                  size="xsmall"
                  color="neutral800">{`$${props.outputUsdValue}`}</Typography>
              </div>
            </div>
          )}
        </div>
        <div className="form">
          <Button
            className="selectors"
            onClick={onChainClick}
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
            size="large">
            {loadingStatus === 'success' && chain
              ? chain.displayName
              : i18n.t('Chain')}
          </Button>
          <Divider size={12} direction="horizontal" />
          <Button
            className="selectors"
            onClick={onTokenClick}
            variant="outlined"
            disabled={
              loadingStatus === 'failed' ||
              (type === 'From' && !fromBlockchain) ||
              (type === 'To' && !toBlockchain)
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
            size="large">
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
                      size="xsmall"
                      color="neutral600">{`$${inputUsdValue}`}</Typography>
                  </span>
                }
                value={inputAmount || ''}
                min={0}
                onChange={
                  type === 'From'
                    ? (event: React.ChangeEvent<HTMLInputElement>) => {
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
