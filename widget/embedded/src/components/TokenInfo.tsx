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
} from '@rango-dev/ui';
import { useMetaStore } from '../store/meta';
import { Token } from 'rango-sdk';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { numberToString } from '../utils/numbers';
import BigNumber from 'bignumber.js';
import { getBalanceFromWallet } from '../utils/wallets';
import { useWalletsStore } from '../store/wallets';
import { useTranslation } from 'react-i18next';
import { PercentageChange } from './PercentageChange';
import { ProviderMeta } from 'rango-types';

type PropTypes = (
  | {
      type: 'From';
      inputAmount: string;
      onAmountChange: (amount: string) => void;
    }
  | {
      type: 'To';
      outputAmount: BigNumber | null;
      outputUsdValue: BigNumber | null;
    }
) & { chain: ProviderMeta | null; token: Token | null };

const Box = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  borderRadius: '$5',
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
  borderRadius: '$5',
  backgroundColor: '$surface',
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
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tokenBalance =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address,
          )?.amount || '0',
          8,
        )
      : '0';

  const tokenBalanceReal =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address,
          )?.amount || '0',
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address,
          )?.decimal,
        )
      : '0';

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
      <Container type={props.type === 'From' ? 'filled' : 'outlined'}>
        <div className="head">
          <Typography variant="body2" color="neutral800">
            {t(type)}
          </Typography>
          {props.type === 'From' ? (
            <Options>
              <div
                className="balance"
                onClick={() => {
                  if (tokenBalance !== '0') setInputAmount(tokenBalanceReal.split(',').join(''));
                }}>
                <Typography variant="body3" color="neutral600">{`${t('Balance')}: ${tokenBalance} ${
                  fromToken?.symbol || ''
                }`}</Typography>
                <Divider size={4} />
                <Button type="primary" variant="ghost" size="compact">
                  {t('Max')}
                </Button>
              </div>
            </Options>
          ) : (
            <div className="output-usd">
              <PercentageChange
                inputUsdValue={inputUsdValue}
                outputUsdValue={props.outputUsdValue}
              />
              <div>
                <Typography variant="caption" color="neutral600">{`$${numberToString(
                  props.outputUsdValue,
                )}`}</Typography>
              </div>
            </div>
          )}
        </div>
        <div className="form">
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
            {loadingStatus === 'success' && chain ? chain.displayName : t('Chain')}
          </Button>
          <Divider size={12} direction="horizontal" />
          <Button
            className="selectors"
            onClick={() => {
              navigate(`${props.type.toLowerCase()}-token`);
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
                <Image src={token.image} size={24} />
              ) : (
                <ImagePlaceholder />
              )
            }
            suffix={ItemSuffix}
            size="large"
            align="start">
            {loadingStatus === 'success' && token ? token.symbol : t('Token')}
          </Button>
          <Divider size={12} direction="horizontal" />
          <div className="amount">
            {props.type === 'From' ? (
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
                    <Typography variant="caption" color="neutral800">{`$${numberToString(
                      inputUsdValue,
                    )}`}</Typography>
                  </span>
                }
                value={props.inputAmount || ''}
                min={0}
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
                <Typography variant="h4">
                  {fetchingBestRoute && '?'}
                  {!!bestRoute?.result && `≈ ${numberToString(props.outputAmount)}`}
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
