import type { SwapDetailsProps } from './SwapDetails.types';
import type { ModalState } from '../SwapDetailsModal';

import { i18n } from '@lingui/core';
import {
  getCurrentBlockchainOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
  PendingSwapNetworkStatus,
} from '@rango-dev/queue-manager-rango-preset';
import {
  Button,
  CopyIcon,
  Divider,
  IconButton,
  QuoteCost,
  StepDetails,
  Typography,
  useCopyToClipboard,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useMetaStore } from '../../store/meta';
import { useNotificationStore } from '../../store/notification';
import { useQuoteStore } from '../../store/quote';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../../utils/numbers';
import { getPriceImpact, getPriceImpactLevel } from '../../utils/quote';
import {
  getLastConvertedTokenInFailedSwap,
  getSwapMessages,
  shouldRetrySwap,
} from '../../utils/swap';
import { getSwapDate } from '../../utils/time';
import { getConciseAddress, getUsdPrice } from '../../utils/wallets';
import { SuffixContainer } from '../HeaderButtons/HeaderButtons.styles';
import { Layout } from '../Layout';
import { QuoteSummary } from '../Quote';
import {
  SwapDetailsCompleteModal,
  SwapDetailsModal,
} from '../SwapDetailsModal';

import { getSteps, getStepState, RESET_INTERVAL } from './SwapDetails.helpers';
import { Container, HeaderDetails, StepsList } from './SwapDetails.styles';

export function SwapDetails(props: SwapDetailsProps) {
  const { swap, requestId, onDelete, onCancel: onCancelProps } = props;
  const { canSwitchNetworkTo, connect, getWalletInfo } = useWallets();
  const retry = useQuoteStore.use.retry();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const [_, handleCopy] = useCopyToClipboard(RESET_INTERVAL);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [showCompletedModal, setShowCompletedModal] = useState<
    'success' | 'failed' | null
  >(null);
  const {
    meta: { tokens, blockchains },
  } = useMetaStore();

  const onCancel = () => {
    onCancelProps();
    setModalState(null);
  };

  const getUnreadNotifications =
    useNotificationStore.use.getUnreadNotifications();
  const setAsRead = useNotificationStore.use.setAsRead();
  const unreadNotifications = getUnreadNotifications();
  const currentStep = getCurrentStep(swap);
  const currentStepNetworkStatus = currentStep?.networkStatus;

  useEffect(() => {
    const existNotification = unreadNotifications.find(
      (n) => n.requestId === swap.requestId
    );
    if (existNotification) {
      if (swap.status === 'success' || swap.status === 'failed') {
        setShowCompletedModal(swap.status);
        setAsRead(swap.requestId);
      }
    }
  }, [swap.status]);

  useEffect(() => {
    if (showSwitchNetwork) {
      setModalState(PendingSwapNetworkStatus.WaitingForNetworkChange);
    } else if (
      currentStepNetworkStatus ===
        PendingSwapNetworkStatus.WaitingForConnectingWallet ||
      currentStepNetworkStatus === PendingSwapNetworkStatus.NetworkChanged
    ) {
      setModalState(currentStepNetworkStatus);
    } else {
      setModalState(null);
    }
  }, [currentStepNetworkStatus]);

  const lastConvertedTokenInFailedSwap =
    getLastConvertedTokenInFailedSwap(swap);

  const currentStepBlockchain = currentStep
    ? getCurrentBlockchainOfOrNull(swap, currentStep)
    : null;
  const currentStepWallet = currentStep
    ? getRelatedWalletOrNull(swap, currentStep)
    : null;

  const swapDate = getSwapDate(swap);
  const shouldRetry = shouldRetrySwap(swap);

  const isMobileWallet = (walletType: string): boolean =>
    !!getWalletInfo(walletType)?.mobileWallet;

  const showSwitchNetwork =
    currentStepNetworkStatus ===
      PendingSwapNetworkStatus.WaitingForNetworkChange &&
    !!currentStepBlockchain &&
    !!currentStepWallet?.walletType &&
    (isMobileWallet(currentStepWallet.walletType) ||
      canSwitchNetworkTo(currentStepWallet.walletType, currentStepBlockchain));

  const switchNetwork = showSwitchNetwork
    ? connect.bind(null, currentStepWallet.walletType, currentStepBlockchain)
    : undefined;

  const stepMessage = getSwapMessages(swap, currentStep);
  const steps = getSteps({
    swap,
    switchNetwork,
    showNetworkModal: currentStepNetworkStatus,
    setNetworkModal: setModalState,
    message: stepMessage,
    blockchains,
  });
  const numberOfSteps = steps.length;
  const [firstStep, lastStep] = [swap.steps[0], swap.steps[numberOfSteps - 1]];
  const outputAmount =
    lastStep.outputAmount || lastStep.expectedOutputAmountHumanReadable;

  const totalFee = swap.steps.reduce(
    (totalFee, steps) => totalFee + parseFloat(steps.feeInUsd || ''),
    0
  );

  const diagnosisUrl = swap.steps.find(
    (step) => step.diagnosisUrl
  )?.diagnosisUrl;

  const outputUsdValue = numberToString(
    String(
      parseFloat(
        numberToString(
          outputAmount,
          TOKEN_AMOUNT_MIN_DECIMALS,
          TOKEN_AMOUNT_MAX_DECIMALS
        )
      ) *
        (getUsdPrice(
          lastStep.toBlockchain,
          lastStep.toSymbol,
          lastStep.toSymbolAddress,
          tokens
        ) || 0)
    ),
    USD_VALUE_MIN_DECIMALS,
    USD_VALUE_MAX_DECIMALS
  );

  const inputUsdValue = numberToString(
    String(
      parseFloat(swap.inputAmount) *
        (getUsdPrice(
          firstStep.fromBlockchain,
          firstStep.fromSymbol,
          firstStep.fromSymbolAddress,
          tokens
        ) || 0)
    ),
    USD_VALUE_MIN_DECIMALS,
    USD_VALUE_MAX_DECIMALS
  );

  const percentageChange = getPriceImpact(inputUsdValue, outputUsdValue);

  const completeModalDesc =
    swap.status === 'success'
      ? i18n.t({
          id: 'You have received {amount} {token} in {conciseAddress} wallet on {chain} chain.',
          values: {
            amount: numberToString(
              outputAmount,
              TOKEN_AMOUNT_MIN_DECIMALS,
              TOKEN_AMOUNT_MAX_DECIMALS
            ),
            token: steps[numberOfSteps - 1].to.token.displayName,
            conciseAddress: getConciseAddress(
              swap.wallets[steps[numberOfSteps - 1].to.chain.displayName]
                ?.address || ''
            ),
            chain: steps[numberOfSteps - 1].to.chain.displayName,
          },
        })
      : `${i18n.t('Transaction was not sent.')} ${
          lastConvertedTokenInFailedSwap
            ? i18n.t({
                id: '{amount} {symbol} on {blockchain} remain in your wallet',
                values: {
                  amount: lastConvertedTokenInFailedSwap.outputAmount,
                  symbol: lastConvertedTokenInFailedSwap.symbol,
                  blockchain: lastConvertedTokenInFailedSwap.blockchain,
                },
              })
            : ''
        }`;

  return (
    <Layout
      noPadding
      header={{
        title: i18n.t('Swap and Bridge'),
        onBack: () => navigateBackFrom(navigationRoutes.swapDetails),
        onCancel:
          swap.status === 'running' ? () => setModalState('cancel') : undefined,
        suffix: swap.status !== 'running' && (
          <SuffixContainer>
            <Button
              variant="ghost"
              type="error"
              size="xsmall"
              onClick={() => setModalState('delete')}>
              <Typography size="medium" variant="label" color="error">
                {i18n.t('Delete')}
              </Typography>
            </Button>
          </SuffixContainer>
        ),
      }}
      footer={
        shouldRetry &&
        !showCompletedModal && (
          <Button
            fullWidth
            variant="contained"
            type="primary"
            size="large"
            onClick={() => {
              retry(swap);
              setTimeout(() => {
                navigate(navigationRoutes.home);
              }, 0);
            }}>
            {i18n.t('Try again')}
          </Button>
        )
      }>
      <Container>
        <HeaderDetails>
          <div className="row">
            <Typography variant="label" size="large" color="neutral700">
              {`${i18n.t('Request ID')}:`}
            </Typography>
            <div className="request-id">
              <Typography variant="label" size="small" color="neutral700">
                {requestId}
              </Typography>
              <IconButton
                variant="ghost"
                onClick={handleCopy.bind(null, requestId || '')}>
                <CopyIcon size={16} color="gray" />
              </IconButton>
            </div>
          </div>
          <div className="row">
            <Typography variant="label" size="large" color="neutral700">
              {`${i18n.t('Created at')}:`}
            </Typography>
            <Typography variant="label" size="small" color="neutral700">
              {swapDate}
            </Typography>
          </div>
        </HeaderDetails>

        <div className="output">
          <QuoteCost
            fee={numberToString(
              String(totalFee),
              GAS_FEE_MIN_DECIMALS,
              GAS_FEE_MAX_DECIMALS
            )}
            time={secondsToString(totalArrivalTime(swap.steps))}
            steps={numberOfSteps}
          />
          <QuoteSummary
            from={{
              price: {
                value: numberToString(
                  swap.inputAmount,
                  TOKEN_AMOUNT_MIN_DECIMALS,
                  TOKEN_AMOUNT_MAX_DECIMALS
                ),
                usdValue: inputUsdValue,
              },
              token: {
                displayName: steps[0].from.token.displayName,
                image: steps[0].from.token.image,
              },
              chain: {
                image: steps[0].from.chain.image,
                displayName: steps[0].from.chain.displayName,
              },
            }}
            to={{
              price: {
                value: numberToString(
                  outputAmount,
                  TOKEN_AMOUNT_MIN_DECIMALS,
                  TOKEN_AMOUNT_MAX_DECIMALS
                ),
                usdValue: outputUsdValue,
              },
              token: {
                displayName: steps[numberOfSteps - 1].to.token.displayName,
                image: steps[numberOfSteps - 1].to.token.image,
              },
              chain: {
                image: steps[numberOfSteps - 1].to.chain.image,
                displayName: steps[numberOfSteps - 1].to.chain.displayName,
              },
            }}
            percentageChange={numberToString(
              String(percentageChange),
              PERCENTAGE_CHANGE_MIN_DECIMALS,
              PERCENTAGE_CHANGE_MAX_DECIMALS
            )}
            warningLevel={getPriceImpactLevel(percentageChange ?? 0)}
          />
        </div>
        <div className="title-steps">
          <Typography variant="title" size="small">
            {i18n.t('Swaps steps')}
          </Typography>
        </div>
        <Divider size={8} />
        <StepsList ref={listRef}>
          {steps.map((step, index) => {
            const key = index;
            const state = getStepState(swap.steps[index]);
            const isFocused =
              state === 'error' ||
              state === 'in-progress' ||
              state === 'warning' ||
              (state === 'completed' && index === steps.length - 1);
            return (
              <StepDetails
                key={key}
                step={step}
                type="swap-progress"
                ref={listRef}
                state={state}
                hasSeparator={index !== 0}
                tabIndex={key}
                isFocused={isFocused}
              />
            );
          })}
        </StepsList>
      </Container>

      <SwapDetailsModal
        state={modalState}
        onClose={() => setModalState(null)}
        onCancel={onCancel}
        onDelete={onDelete}
        message={stepMessage.detailedMessage.content}
        currentStepWallet={currentStepWallet}
      />
      <SwapDetailsCompleteModal
        open={!!showCompletedModal}
        diagnosisUrl={diagnosisUrl}
        onClose={() => setShowCompletedModal(null)}
        status={swap.status === 'success' ? 'success' : 'failed'}
        priceValue={numberToString(
          outputAmount,
          TOKEN_AMOUNT_MIN_DECIMALS,
          TOKEN_AMOUNT_MAX_DECIMALS
        )}
        usdValue={outputUsdValue}
        percentageChange={numberToString(
          String(percentageChange),
          PERCENTAGE_CHANGE_MIN_DECIMALS,
          PERCENTAGE_CHANGE_MAX_DECIMALS
        )}
        token={{
          displayName: steps[numberOfSteps - 1].to.token.displayName,
          image: steps[numberOfSteps - 1].to.token.image,
        }}
        chain={{ image: steps[numberOfSteps - 1].to.chain.image }}
        description={completeModalDesc}
      />
    </Layout>
  );
}
