import { i18n } from '@lingui/core';
import {
  Alert,
  BestRoute,
  Button,
  styled,
  SwapInput,
  // TokenInfo,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeButtons } from '../components/HeaderButtons';
import { Layout } from '../components/Layout';
import { SwithFromAndToButton } from '../components/SwitchFromAndTo';
import { errorMessages } from '../constants/errors';
import { navigationRoutes } from '../constants/navigationRoutes';
import { fetchBestRoute, useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import { numberToString } from '../utils/numbers';
import {
  canComputePriceImpact,
  getOutputRatio,
  getPercentageChange,
  getSwapButtonState,
  hasLimitError,
  LimitErrorMessage,
  outputRatioHasWarning,
} from '../utils/swap';
import { getBalanceFromWallet } from '../utils/wallets';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const FromContainer = styled('div', {
  position: 'relative',
});

const InputsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  alignSelf: 'stretch',
});

const BestRouteContainer = styled('div', {
  width: '100%',
  paddingTop: '$16',
});
const Alerts = styled('div', {
  width: '100%',
  paddingTop: '$16',
});
const Footer = styled('div', {
  width: '100%',
  paddingTop: '$16',
});

const balancePercision = 8;

export function Home() {
  const navigate = useNavigate();
  const fromChain = useBestRouteStore.use.fromChain();
  const fromToken = useBestRouteStore.use.fromToken();
  const toChain = useBestRouteStore.use.toChain();
  const toToken = useBestRouteStore.use.toToken();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const inputUsdValue = useBestRouteStore.use.inputUsdValue();
  const inputAmount = useBestRouteStore.use.inputAmount();
  // const outputAmount = useBestRouteStore.use.outputAmount();
  const outputUsdValue = useBestRouteStore.use.outputUsdValue();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const bestRouteError = useBestRouteStore.use.error();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const setCurrentPage = useUiStore.use.setCurrentPage();
  const errorMessage =
    loadingMetaStatus === 'failed'
      ? errorMessages.genericServerError
      : bestRouteError;

  const showBestRoute =
    !!inputAmount && (!!bestRoute || fetchingBestRoute || !!bestRouteError);

  const { fromAmountRangeError, recommendation, swap } =
    LimitErrorMessage(bestRoute);

  const needsToWarnEthOnPath = false;

  const outToInRatio = getOutputRatio(inputUsdValue, outputUsdValue);
  const highValueLoss = outputRatioHasWarning(inputUsdValue, outToInRatio);

  const priceImpactCanNotBeComputed = !canComputePriceImpact(
    bestRoute,
    inputAmount,
    inputUsdValue,
    outputUsdValue
  );
  const swapButtonState = getSwapButtonState(
    loadingMetaStatus,
    connectedWallets,
    fetchingBestRoute,
    bestRoute,
    hasLimitError(bestRoute),
    highValueLoss,
    priceImpactCanNotBeComputed,
    needsToWarnEthOnPath,
    inputAmount
  );

  const tokenBalance =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || '0',
          balancePercision
        )
      : '0';

  /*
   * const tokenBalanceReal =
   *   !!fromChain && !!fromToken
   *     ? numberToString(
   *         getBalanceFromWallet(
   *           connectedWallets,
   *           fromChain?.name,
   *           fromToken?.symbol,
   *           fromToken?.address
   *         )?.amount || '0',
   *         getBalanceFromWallet(
   *           connectedWallets,
   *           fromChain?.name,
   *           fromToken?.symbol,
   *           fromToken?.address
   *         )?.decimal
   *       )
   *     : '0';
   */

  useEffect(() => {
    setCurrentPage(navigationRoutes.home);

    return setCurrentPage.bind(null, '');
  }, []);

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPercentageChange(
          inputUsdValue.toNumber(),
          outputUsdValue.toNumber()
        );

  return (
    <Layout
      hasFooter
      header={{
        hasConnectWallet: true,
        title: i18n.t('Swap'),
        suffix: (
          <HomeButtons
            onClickRefresh={
              !!bestRoute || bestRouteError ? fetchBestRoute : undefined
            }
            onClickHistory={() => navigate(navigationRoutes.swaps)}
            onClickSettings={() => navigate(navigationRoutes.settings)}
          />
        ),
      }}>
      <Container>
        <InputsContainer>
          <FromContainer>
            <SwapInput
              label="from"
              onInputChange={setInputAmount}
              balance={tokenBalance}
              chain={{
                displayName: fromChain?.displayName || '',
                image: fromChain?.logo || '',
              }}
              token={{
                displayName: fromToken?.name || '',
                image: fromToken?.image || '',
              }}
              onClickToken={() => navigate('from-token')}
              price={{
                value: inputAmount,
                usdValue: numberToString(inputUsdValue),
              }}
            />
            <SwithFromAndToButton />
          </FromContainer>
          <SwapInput
            label="to"
            chain={{
              displayName: toChain?.displayName || '',
              image: toChain?.logo || '',
            }}
            token={{
              displayName: toToken?.name || '',
              image: toToken?.image || '',
            }}
            percentageChange={numberToString(percentageChange)}
            price={{
              value: inputAmount,
              usdValue: numberToString(inputUsdValue),
            }}
            onClickToken={() => navigate('to-token')}
          />
        </InputsContainer>
        {showBestRoute && (
          <BestRouteContainer>
            <BestRoute
              type="basic"
              recommended={true}
              input={{ value: '1', usdValue: '30000' }}
              output={{ value: '3161.441024', usdValue: '26.890' }}
              steps={[
                {
                  swapper: {
                    displayName: 'MayaProtocol',
                    image: 'https://api.rango.exchange/swappers/maya.jpg',
                  },
                  from: {
                    token: {
                      displayName: 'BTC',
                      image: 'https://api.rango.exchange/tokens/BTC/BTC.png',
                    },
                    chain: {
                      displayName: 'BTC',
                      image: 'https://api.rango.exchange/tokens/BTC/BTC.png',
                    },
                    price: {
                      value: '1.00000000',
                    },
                  },
                  to: {
                    chain: {
                      displayName: 'ETH',
                      image:
                        'https://api.rango.exchange/blockchains/ethereum.svg',
                    },
                    token: {
                      displayName: 'ETH',

                      image: 'https://api.rango.exchange/tokens/ETH/ETH.png',
                    },
                    price: {
                      value: '14.863736725876758517',
                    },
                  },
                },
                {
                  swapper: {
                    displayName: 'Satellite',
                    image: 'https://api.rango.exchange/swappers/satellite.png',
                  },
                  from: {
                    token: {
                      displayName: 'ETH',
                      image: 'https://api.rango.exchange/tokens/ETH/ETH.png',
                    },
                    chain: {
                      displayName: 'ETH',
                      image:
                        'https://api.rango.exchange/blockchains/ethereum.svg',
                    },
                    price: { value: '14.863736725876758517' },
                  },
                  to: {
                    token: {
                      displayName: 'ETH',
                      image: 'https://api.rango.exchange/tokens/COSMOS/ETH.png',
                    },
                    chain: {
                      displayName: 'OSMOSIS',
                      image:
                        'https://api.rango.exchange/blockchains/osmosis.svg',
                    },
                    price: {
                      value: '14.825674725876758517',
                    },
                  },
                },
                {
                  swapper: {
                    displayName: 'Osmosis',
                    image: 'https://api.rango.exchange/swappers/osmosis.png',
                  },
                  from: {
                    token: {
                      displayName: 'ETH',
                      image: 'https://api.rango.exchange/tokens/COSMOS/ETH.png',
                    },
                    chain: {
                      displayName: 'OSMOSIS',
                      image:
                        'https://api.rango.exchange/blockchains/osmosis.svg',
                    },
                    price: {
                      value: '14.825674725876758517',
                    },
                  },
                  to: {
                    token: {
                      displayName: 'ATOM',
                      image:
                        'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
                    },
                    chain: {
                      displayName: 'OSMOSIS',
                      image:
                        'https://api.rango.exchange/blockchains/osmosis.svg',
                    },
                    price: {
                      value: '3161.441024',
                    },
                  },
                },
                {
                  swapper: {
                    displayName: 'IBC',
                    image: 'https://api.rango.exchange/swappers/IBC.png',
                  },
                  from: {
                    token: {
                      displayName: 'ATOM',
                      image:
                        'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
                    },
                    chain: {
                      displayName: 'OSMOSIS',
                      image:
                        'https://api.rango.exchange/blockchains/osmosis.svg',
                    },
                    price: {
                      value: '3161.441024',
                    },
                  },
                  to: {
                    token: {
                      displayName: 'ATOM',
                      image:
                        'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
                    },
                    chain: {
                      displayName: 'COSMOS',
                      image:
                        'https://api.rango.exchange/blockchains/cosmos.svg',
                    },
                    price: {
                      value: '3161.441024',
                    },
                  },
                },
              ]}
              percentageChange="7.51"
              warningLevel="high"
              totalFee="9.90"
              totalTime="23:00"
            />
          </BestRouteContainer>
        )}
        {(errorMessage || hasLimitError(bestRoute)) && (
          <Alerts>
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
            {hasLimitError(bestRoute) && (
              <Alert type="error" title={`${swap?.swapperId} Limit`}>
                <>
                  <Typography variant="body" size="small">
                    {`${fromAmountRangeError}, Yours: ${numberToString(
                      swap?.fromAmount || null
                    )} ${swap?.from.symbol}`}
                  </Typography>
                  <Typography variant="body" size="small">
                    {recommendation}
                  </Typography>
                </>
              </Alert>
            )}
          </Alerts>
        )}
        <Footer>
          <Button
            type="primary"
            size="large"
            disabled={swapButtonState.disabled}
            fullWidth
            onClick={() => {
              if (swapButtonState.title === 'Connect Wallet') {
                navigate(navigationRoutes.wallets);
              } else {
                navigate(navigationRoutes.confirmSwap, { replace: true });
              }
            }}>
            {swapButtonState.title}
          </Button>
        </Footer>
      </Container>
    </Layout>
  );
}
