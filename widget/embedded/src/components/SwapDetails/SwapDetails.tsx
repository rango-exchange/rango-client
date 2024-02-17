import type { SwapDetailsProps } from './SwapDetails.types';
import type { ModalState } from '../SwapDetailsModal';

import { i18n } from '@lingui/core';
import {
  getCurrentBlockchainOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
} from '@rango-dev/queue-manager-rango-preset';
import {
  Button,
  CopyIcon,
  Divider,
  IconButton,
  LinkIcon,
  QuoteCost,
  StepDetails,
  Typography,
  useCopyToClipboard,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import BigNumber from 'bignumber.js';
import { PendingSwapNetworkStatus } from 'rango-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SCANNER_BASE_URL } from '../../constants';
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
import { useUiStore } from '../../store/ui';
import { getContainer } from '../../utils/common';
import {
  formatTooltipNumbers,
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
import { getConciseAddress } from '../../utils/wallets';
import { SuffixContainer } from '../HeaderButtons/HeaderButtons.styles';
import { Layout, PageContainer } from '../Layout';
import { QuoteSummary } from '../Quote';
import {
  SwapDetailsCompleteModal,
  SwapDetailsModal,
} from '../SwapDetailsModal';

import { getSteps, getStepState, RESET_INTERVAL } from './SwapDetails.helpers';
import {
  HeaderDetails,
  outputStyles,
  requestIdStyles,
  rowStyles,
  StepsList,
  StyledLink,
  titleStepsStyles,
} from './SwapDetails.styles';

export function SwapDetails(props: SwapDetailsProps) {
  const { swap, requestId, onDelete, onCancel: onCancelProps } = props;
  const { canSwitchNetworkTo, connect, getWalletInfo } = useWallets();
  const blockchains = useAppStore().blockchains();
  const swappers = useAppStore().swappers();
  const tokens = useAppStore().tokens();
  const retry = useQuoteStore.use.retry();
  const isActiveTab = useUiStore.use.isActiveTab();
  const navigate = useNavigate();
  const [_, handleCopy] = useCopyToClipboard(RESET_INTERVAL);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [showCompletedModal, setShowCompletedModal] = useState<
    'success' | 'failed' | null
  >(null);

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
    parseFloat(
      numberToString(
        outputAmount,
        TOKEN_AMOUNT_MIN_DECIMALS,
        TOKEN_AMOUNT_MAX_DECIMALS
      )
    ) * (lastStep.toUsdPrice || 0),
    USD_VALUE_MIN_DECIMALS,
    USD_VALUE_MAX_DECIMALS
  );

  const inputUsdValue = numberToString(
    parseFloat(swap.inputAmount) * (firstStep.fromUsdPrice || 0),
    USD_VALUE_MIN_DECIMALS,
    USD_VALUE_MAX_DECIMALS
  );

  const realOutputUsdValue = outputAmount
    ? formatTooltipNumbers(
        new BigNumber(outputAmount).multipliedBy(lastStep.toUsdPrice || 0)
      )
    : '';

  const realInputUsdValue = formatTooltipNumbers(
    new BigNumber(swap.inputAmount).multipliedBy(firstStep.fromUsdPrice || 0)
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
      header={{
        title: i18n.t('Swap and Bridge'),
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
              retry(swap, { blockchains: blockchains, tokens: tokens });
              setTimeout(() => {
                const home = '../../';
                navigate(home);
              }, 0);
            }}>
            {i18n.t('Try again')}
          </Button>
        )
      }>
      <PageContainer compact view>
        <HeaderDetails>
          <div className={rowStyles()}>
            <Typography variant="label" size="large" color="neutral700">
              {`${i18n.t('Request ID')}:`}
            </Typography>
            <div className={requestIdStyles()}>
              <Typography variant="label" size="small" color="neutral700">
                {requestId}
              </Typography>
              <IconButton
                variant="ghost"
                onClick={handleCopy.bind(null, requestId || '')}>
                <CopyIcon size={16} color="gray" />
              </IconButton>
              <StyledLink
                target="_blank"
                href={`${SCANNER_BASE_URL}/swap/${requestId}`}>
                <LinkIcon size={16} />
              </StyledLink>
            </div>
          </div>
          <div className={rowStyles()}>
            <Typography variant="label" size="large" color="neutral700">
              {`${i18n.t(swap.finishTime ? 'Finished at' : 'Created at')}:`}
            </Typography>
            <Typography variant="label" size="small" color="neutral700">
              {swapDate}
            </Typography>
          </div>
        </HeaderDetails>

        <div className={outputStyles()}>
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
                realValue: outputAmount,
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
                tooltipContainer={getContainer()}
              />
            );
          })}
        </StepsList>
      </PageContainer>

      <SwapDetailsModal
        state={modalState}
        onClose={() => setModalState(null)}
        onCancel={onCancel}
        onDelete={onDelete}
        message={stepMessage.detailedMessage.content}
        currentStepWallet={currentStepWallet}
        walletButtonDisabled={!isActiveTab}
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
        realValue={formatTooltipNumbers(outputAmount)}
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
