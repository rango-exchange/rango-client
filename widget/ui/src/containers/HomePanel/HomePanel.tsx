import type { ConnectedWallet } from '../..';
import type { LoadingStatus, TokenWithBalance } from '../../types/meta';
import type { BestRouteResponse, BlockchainMeta, SwapResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import React from 'react';

import {
  Alert,
  BottomLogo,
  Button,
  Header,
  TokenInfo,
  Typography,
} from '../..';
import { styled } from '../../theme';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const FromContainer = styled('div', {
  position: 'relative',
  paddingBottom: '$12',
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
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  paddingTop: '$16',
});

interface HomePanelProps {
  bestRoute: BestRouteResponse | null;
  bestRouteError: string;
  fetchBestRoute: () => void;
  onClickHistory: () => void;
  onClickSettings: () => void;
  fromBlockchain: BlockchainMeta | null;
  toBlockchain: BlockchainMeta | null;
  fromToken: TokenWithBalance | null;
  toToken: TokenWithBalance | null;
  setInputAmount: (amount: string) => void;
  outputAmount: string;
  outputUsdValue: string;
  inputUsdValue: string;
  inputAmount: string;
  loadingStatus: LoadingStatus;
  showBestRoute: boolean;
  fetchingBestRoute: boolean;
  swapButtonTitle: string;
  swapButtonDisabled: boolean;
  swapButtonClick: () => void;
  onChainClick: (route: 'from-chain' | 'to-chain') => void;
  onTokenClick: (route: 'from-token' | 'to-token') => void;
  connectedWallets: ConnectedWallet[];
  highFee: boolean;
  errorMessage: string;
  hasLimitError: (bestRoute: BestRouteResponse | null) => boolean;
  swap: SwapResult | null;
  swapFromAmount: string | null;
  fromAmountRangeError: string;
  recommendation: string;
  totalFeeInUsd: string;
  swithFromAndToComponent: React.ReactNode;
  percentageChange: string;
  tokenBalanceReal: string;
  tokenBalance: string;
  totalTime: string;
  bestRouteData: BestRouteResponse | null;
  showPercentageChange: boolean;
}

/**
 * @deprecated Will be removed in v2
 */
export function HomePanel({
  bestRoute,
  fromBlockchain,
  toBlockchain,
  fromToken,
  toToken,
  setInputAmount,
  outputAmount,
  inputAmount,
  loadingStatus,
  showBestRoute,
  fetchingBestRoute,
  outputUsdValue,
  inputUsdValue,
  swapButtonTitle,
  swapButtonDisabled,
  swapButtonClick,
  onChainClick,
  onTokenClick,
  connectedWallets,
  errorMessage,
  hasLimitError,
  swap,
  fromAmountRangeError,
  recommendation,
  swithFromAndToComponent,
  percentageChange,
  tokenBalanceReal,
  tokenBalance,
  swapFromAmount,
  showPercentageChange,
}: HomePanelProps) {
  return (
    <Container>
      <Header title={i18n.t('SWAP')} suffix={<></>} />
      <FromContainer>
        <>
          <TokenInfo
            type="From"
            chain={fromBlockchain}
            token={fromToken}
            onAmountChange={setInputAmount}
            inputAmount={inputAmount}
            fromBlockchain={fromBlockchain}
            toBlockchain={toBlockchain}
            loadingStatus={loadingStatus}
            inputUsdValue={inputUsdValue}
            fromToken={fromToken}
            setInputAmount={setInputAmount}
            connectedWallets={connectedWallets}
            bestRoute={bestRoute}
            fetchingBestRoute={fetchingBestRoute}
            onChainClick={() => onChainClick('from-chain')}
            onTokenClick={() => onTokenClick('from-token')}
            tokenBalanceReal={tokenBalanceReal}
            tokenBalance={tokenBalance}
          />
          {swithFromAndToComponent}
        </>
      </FromContainer>
      <TokenInfo
        type="To"
        chain={toBlockchain}
        token={toToken}
        outputAmount={outputAmount}
        percentageChange={percentageChange}
        outputUsdValue={outputUsdValue}
        fromBlockchain={fromBlockchain}
        toBlockchain={toBlockchain}
        loadingStatus={loadingStatus}
        inputUsdValue={inputUsdValue}
        fromToken={fromToken}
        setInputAmount={setInputAmount}
        connectedWallets={connectedWallets}
        inputAmount={inputAmount}
        bestRoute={bestRoute}
        fetchingBestRoute={fetchingBestRoute}
        onChainClick={() => onChainClick('to-chain')}
        onTokenClick={() => onTokenClick('to-token')}
        tokenBalanceReal={tokenBalanceReal}
        tokenBalance={tokenBalance}
        showPercentageChange={showPercentageChange}
      />
      {showBestRoute && <BestRouteContainer></BestRouteContainer>}
      {(errorMessage || hasLimitError(bestRoute)) && (
        <Alerts>
          {errorMessage && <Alert type="error">{errorMessage}</Alert>}
          {hasLimitError(bestRoute) && (
            <Alert type="error" title={`${swap?.swapperId} Limit`}>
              <>
                <Typography variant="body" size="small">
                  {`${fromAmountRangeError}, Yours: ${swapFromAmount} ${swap?.from.symbol}`}
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
          disabled={swapButtonDisabled}
          onClick={swapButtonClick}>
          {swapButtonTitle}
        </Button>
        <BottomLogo />
      </Footer>
    </Container>
  );
}
