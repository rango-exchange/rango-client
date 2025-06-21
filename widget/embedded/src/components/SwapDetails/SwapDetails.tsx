import type { SwapDetailsProps } from './SwapDetails.types';
import type { ModalState } from '../SwapDetailsModal';
import type { SwitchNetworkModalState } from '../SwapDetailsModal/SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import {
  getCurrentNamespaceOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
} from '@rango-dev/queue-manager-rango-preset';
import {
  Button,
  Divider,
  QuoteCost,
  StepDetails,
  Typography,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import BigNumber from 'bignumber.js';
import { PendingSwapNetworkStatus } from 'rango-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { useQuoteStore } from '../../store/quote';
import { getContainer } from '../../utils/common';
import {
  numberToString,
  roundedSecondsToString,
  totalArrivalTime,
} from '../../utils/numbers';
import {
  createRetryQuote,
  getPriceImpact,
  getPriceImpactLevel,
} from '../../utils/quote';
import {
  getLastConvertedTokenInFailedSwap,
  getSwapMessages,
  shouldRetrySwap,
} from '../../utils/swap';
import { getSwapDate } from '../../utils/time';
import { getConciseAddress } from '../../utils/wallets';
import { SuffixContainer } from '../HeaderButtons/HeaderButtons.styles';
import { Layout } from '../Layout';
import { QuoteSummary } from '../Quote';
import {
  SwapDetailsCompleteModal,
  SwapDetailsModal,
} from '../SwapDetailsModal';

import { RequestIdRow } from './RequestIdRow';
import { SwapDateRow } from './SwapDateRow';
import { getSteps, getStepState } from './SwapDetails.helpers';
import {
  Container,
  ErrorMessages,
  MessageText,
  outputStyles,
  StepsList,
  titleStepsStyles,
} from './SwapDetails.styles';

export function SwapDetails(props: SwapDetailsProps) {
  const { swap, requestId, onDelete, onCancel } = props;
  const { canSwitchNetworkTo, connect, getWalletInfo } = useWallets();
  const blockchains = useAppStore().blockchains();
  const swappers = useAppStore().swappers();
  const { findToken } = useAppStore();
  const retry = useQuoteStore.use.retry();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [switchNetworkModalState, setSwitchNetworkModalState] =
    useState<SwitchNetworkModalState | null>(null);
  const [showCompletedModal, setShowCompletedModal] = useState<
    'success' | 'failed' | null
  >(null);

  const getNotifications = useNotificationStore.use.getNotifications();
  const removeNotification = useNotificationStore.use.removeNotification();
  const notifications = getNotifications();
  const currentStep = getCurrentStep(swap);
  const currentStepNetworkStatus = currentStep?.networkStatus;

  const handleChangeModalState = (state: ModalState) => {
    setIsModalOpen(true);
    setModalState(state);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleShowSwitchNetworkLoading = () => {
    setSwitchNetworkModalState({
      type: 'loading',
      title: i18n.t('Change Network'),
      description: `We’re switching the connected network to ${currentStepNamespace?.network}. Please check your wallet.`,
    });
  };
  const handleShowSwitchNetworkSucceeded = () => {
    setSwitchNetworkModalState({
      type: 'success',
      title: i18n.t('Network Changed'),
      description: 'The network has been successfully changed.',
    });
  };
  const handleShowSwitchNetworkFailed = (error?: Error) => {
    setSwitchNetworkModalState({
      type: 'error',
      title: i18n.t('Network Switch Failed'),
      description: error?.message || stepMessage.detailedMessage.content,
    });
  };

  const lastConvertedTokenInFailedSwap =
    getLastConvertedTokenInFailedSwap(swap);

  const currentStepNamespace = currentStep
    ? getCurrentNamespaceOfOrNull(swap, currentStep)
    : null;
  const currentStepWallet = currentStep
    ? getRelatedWalletOrNull(swap, currentStep)
    : null;

  const swapDate = getSwapDate(swap);
  const shouldRetry = shouldRetrySwap(swap);

  const checkIsMobileWallet = (walletType: string): boolean =>
    !!getWalletInfo(walletType)?.mobileWallet;

  const stepIsBlockedForSwitchNetwork =
    !!currentStepNetworkStatus &&
    [
      PendingSwapNetworkStatus.WaitingForNetworkChange,
      PendingSwapNetworkStatus.NetworkChangeFailed,
    ].includes(currentStepNetworkStatus);
  const isMobileWallet =
    !!currentStepWallet?.walletType &&
    checkIsMobileWallet(currentStepWallet.walletType);
  const canSwitchNetworkToRequiredNetwork =
    !!currentStepWallet &&
    !!currentStepNamespace &&
    canSwitchNetworkTo(
      currentStepWallet.walletType,
      currentStepNamespace.network
    );

  const switchNetworkIsAvailable =
    !!currentStepNamespace &&
    stepIsBlockedForSwitchNetwork &&
    (isMobileWallet || canSwitchNetworkToRequiredNetwork);

  const handleSwitchNetwork = () => {
    if (switchNetworkIsAvailable) {
      handleShowSwitchNetworkLoading();
      connect(currentStepWallet.walletType, [
        {
          namespace: currentStepNamespace.namespace,
          network: currentStepNamespace.network,
        },
      ])
        .then(() => {
          handleShowSwitchNetworkSucceeded();
        })
        .catch((error: unknown) => {
          handleShowSwitchNetworkFailed(error as Error);
        });
    }
  };

  const handleSwitchNetworkClick = () => {
    handleChangeModalState('switchNetwork');
    handleSwitchNetwork();
  };

  const stepMessage = getSwapMessages(swap, currentStep, getWalletInfo);
  const steps = getSteps({
    swap,
    switchNetworkIsAvailable,
    handleSwitchNetworkClick,
    showNetworkModal: currentStepNetworkStatus,
    setNetworkModal: handleChangeModalState,
    message: stepMessage,
    blockchains: blockchains,
    swappers,
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
    parseFloat(outputAmount || '0') * (lastStep.toUsdPrice || 0),
    USD_VALUE_MIN_DECIMALS,
    USD_VALUE_MAX_DECIMALS
  );

  const inputUsdValue = numberToString(
    parseFloat(swap.inputAmount) * (firstStep.fromUsdPrice || 0),
    USD_VALUE_MIN_DECIMALS,
    USD_VALUE_MAX_DECIMALS
  );

  const realOutputUsdValue = outputAmount
    ? new BigNumber(outputAmount)
        .multipliedBy(lastStep.toUsdPrice || 0)
        .toString()
    : '';

  const realInputUsdValue = new BigNumber(swap.inputAmount)
    .multipliedBy(firstStep.fromUsdPrice || 0)
    .toString();

  const percentageChange = getPriceImpact(inputUsdValue, outputUsdValue);

  const stepDetailMessage =
    stepMessage.detailedMessage.content || stepMessage.shortMessage;

  const completeModalDesc =
    swap.status === 'success' ? (
      i18n.t({
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
    ) : (
      <ErrorMessages>
        <Typography
          variant="body"
          size="medium"
          color="neutral700"
          align="center">
          {!stepDetailMessage ? i18n.t('Transaction was not sent.') : ''}
          {lastConvertedTokenInFailedSwap
            ? `${i18n.t({
                id: '{amount} {symbol} on {blockchain} remains in your wallet.',
                values: {
                  amount: lastConvertedTokenInFailedSwap.outputAmount,
                  symbol: lastConvertedTokenInFailedSwap.symbol,
                  blockchain: lastConvertedTokenInFailedSwap.blockchain,
                },
              })}`
            : ''}
        </Typography>
        {stepDetailMessage && (
          <MessageText
            align="center"
            variant="body"
            size="medium"
            color="neutral700">
            <b>Reason:</b> {stepDetailMessage}
          </MessageText>
        )}
      </ErrorMessages>
    );

  useEffect(() => {
    const existNotification = notifications.find(
      (n) => n.requestId === swap.requestId
    );
    if (existNotification) {
      if (swap.status === 'success' || swap.status === 'failed') {
        setShowCompletedModal(swap.status);
        removeNotification(swap.requestId);
        handleCloseModal();
      } else if (showCompletedModal) {
        setShowCompletedModal(null);
      }
    }
  }, [swap.status, swap.requestId]);

  useEffect(() => {
    if (switchNetworkIsAvailable) {
      handleChangeModalState('switchNetwork');
      if (
        currentStepNetworkStatus ===
        PendingSwapNetworkStatus.WaitingForNetworkChange
      ) {
        handleShowSwitchNetworkLoading();
        return;
      }
      if (
        currentStepNetworkStatus ===
        PendingSwapNetworkStatus.NetworkChangeFailed
      ) {
        handleShowSwitchNetworkFailed();
        return;
      }
      return;
    }

    if (
      currentStepNetworkStatus ===
      PendingSwapNetworkStatus.WaitingForConnectingWallet
    ) {
      handleChangeModalState('connectWallet');
      return;
    }

    if (currentStepNetworkStatus === PendingSwapNetworkStatus.NetworkChanged) {
      handleChangeModalState('switchNetwork');
      handleShowSwitchNetworkSucceeded();
      return;
    }

    if (modalState && ['connectWallet', 'switchNetwork'].includes(modalState)) {
      handleCloseModal();
    }
  }, [currentStepNetworkStatus]);

  return (
    <Layout
      header={{
        title: i18n.t('Swap Details'),
        onCancel:
          swap.status === 'running'
            ? () => handleChangeModalState('cancel')
            : undefined,
        suffix: swap.status !== 'running' && (
          <SuffixContainer>
            <Button
              id="widget-swap-details-delete-btn"
              variant="ghost"
              type="error"
              size="xsmall"
              onClick={() => handleChangeModalState('delete')}>
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
            id="widget-swap-details-try-again-btn"
            variant="contained"
            type="primary"
            size="large"
            onClick={() => {
              const swapInput = createRetryQuote(swap, blockchains, findToken);
              retry(swapInput);
              setTimeout(() => {
                const home = '../../';
                navigate(home);
              }, 0);
            }}>
            {i18n.t('Try again')}
          </Button>
        )
      }>
      <Container compact ref={containerRef}>
        <RequestIdRow requestId={requestId} />
        <SwapDateRow date={swapDate} isFinished={!!swap.finishTime} />

        <div className={outputStyles()}>
          <QuoteCost
            fee={numberToString(
              String(totalFee),
              GAS_FEE_MIN_DECIMALS,
              GAS_FEE_MAX_DECIMALS
            )}
            time={roundedSecondsToString(totalArrivalTime(swap.steps))}
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
                realUsdValue: realInputUsdValue,
                realValue: swap.inputAmount,
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
                realUsdValue: realOutputUsdValue,
                realValue: outputAmount || '',
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
              percentageChange,
              PERCENTAGE_CHANGE_MIN_DECIMALS,
              PERCENTAGE_CHANGE_MAX_DECIMALS
            )}
            warningLevel={getPriceImpactLevel(percentageChange ?? 0)}
          />
        </div>
        <div className={titleStepsStyles()}>
          <Typography variant="title" size="small">
            {i18n.t('Swaps steps')}
          </Typography>
        </div>
        <Divider size={8} />
        <StepsList>
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
                className={'widget-swap-details-step-item-container'}
                key={key}
                step={step}
                type="swap-progress"
                ref={containerRef}
                state={state}
                hasSeparator={index !== 0}
                tabIndex={key}
                isFocused={isFocused}
                tooltipContainer={getContainer()}
              />
            );
          })}
        </StepsList>
      </Container>

      <SwapDetailsModal
        isOpen={isModalOpen}
        state={modalState}
        switchNetworkModalState={switchNetworkModalState}
        onClose={handleCloseModal}
        onCancel={onCancel}
        onDelete={onDelete}
        message={stepMessage.detailedMessage.content}
        swap={swap}
        handleSwitchNetwork={handleSwitchNetworkClick}
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
        realUsdValue={realOutputUsdValue}
        realValue={outputAmount || ''}
        percentageChange={numberToString(
          percentageChange,
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
