import type { ConnectedWallet } from '../..';
import type { LoadingStatus, TokenWithBalance } from '../../types/meta';
import type { BestRouteResponse, BlockchainMeta, SwapResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import React from 'react';

import {
  Alert,
  BestRoute,
  BottomLogo,
  Button,
  Header,
  HeaderButtons,
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
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
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

export function HomePanel({
  bestRoute,
  bestRouteError,
  fetchBestRoute,
  onClickHistory,
  onClickSettings,
  fromChain,
  toChain,
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
  highFee,
  errorMessage,
  hasLimitError,
  swap,
  fromAmountRangeError,
  recommendation,
  totalFeeInUsd,
  swithFromAndToComponent,
  percentageChange,
  tokenBalanceReal,
  tokenBalance,
  totalTime,
  bestRouteData,
  swapFromAmount,
  showPercentageChange,
}: HomePanelProps) {
  return (
    <Container>
      <Header
        title={i18n.t('SWAP')}
        suffix={
          <HeaderButtons
            onClickRefresh={
              !!bestRoute || bestRouteError ? fetchBestRoute : undefined
            }
            onClickHistory={onClickHistory}
            onClickSettings={onClickSettings}
          />
        }
      />
      <FromContainer>
        <>
          <TokenInfo
            type="From"
            chain={fromChain}
            token={fromToken}
            onAmountChange={setInputAmount}
            inputAmount={inputAmount}
            fromChain={fromChain}
            toChain={toChain}
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
        chain={toChain}
        token={toToken}
        outputAmount={outputAmount}
        percentageChange={percentageChange}
        outputUsdValue={outputUsdValue}
        fromChain={fromChain}
        toChain={toChain}
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
      {showBestRoute && (
        <BestRouteContainer>
          <BestRoute
            error={bestRouteError}
            loading={fetchingBestRoute}
            data={bestRouteData}
            totalFee={totalFeeInUsd}
            feeWarning={highFee}
            totalTime={totalTime}
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
          align="grow"
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
