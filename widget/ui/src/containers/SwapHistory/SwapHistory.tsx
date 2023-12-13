import type { PropTypes as SwapMessagesPropTypes } from './SwapMessages';
import type { PendingSwap } from 'rango-types';

import React, { useState } from 'react';

import {
  Alert,
  Button,
  Divider,
  Drawer,
  Image,
  SecondaryPage,
  Spinner,
  StepDetail,
  Typography,
} from '../../components';
import {
  CheckCircleIcon,
  GasIcon,
  InfoCircleIcon,
} from '../../components/Icon';
import { keyframes, styled } from '../../theme';

import { SwapMessages } from './SwapMessages';

export const pulse = keyframes({
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.3,
  },
  '100%': {
    opacity: 1,
  },
});

export const SwapperContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '$4',
  variants: {
    created: {
      true: {
        filter: 'grayscale(100%)',
      },
    },
    running: {
      true: {
        animation: `${pulse} 2s ease-in-out infinite`,
      },
    },
  },
});

export const BodyError = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorMsg = styled(Typography, {
  color: '$error500',
});

export const FeeContainer = styled('div', {
  paddingLeft: '$16',
  color: '$neutral600',
});

export const Fee = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const RelativeContainer = styled('div', {
  position: 'relative',
});

export const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const Dot = styled('div', {
  width: '$8',
  height: '$8',
  backgroundColor: '$foreground',
  borderRadius: '4px',
  marginLeft: '11px',
});

export const ArrowDown = styled('div', {
  width: '0px',
  height: '0px',
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid $foreground',
  marginLeft: '$10',
});

const StyledAnchor = styled('a', {
  color: '$primary500',
  fontWeight: '$600',
});

const SwapInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '$16',
  borderBottom: '1px solid $background',
});

const InternalDetailsContainer = styled('div', {
  display: 'flex',
  '.details': {
    padding: '$8 0',
  },
});

const InternalDetail = styled('div', {
  display: 'flex',
  margin: '$12 0 $12 $20',
});

const DescriptionContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const Description = styled(Typography, {
  color: '$success500',
  paddingLeft: '$4',
});

export const Line = styled('div', {
  width: '0',
  minHeight: '$16',
  marginLeft: '14px',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});

const Row = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '$14',
  padding: '$8 0',

  '.name': {
    color: '$neutral800',
  },
  '.value': {
    display: 'flex',
    alignItems: 'center',
    color: '$neutral600',
    justifyContent: 'flex-end',
  },
  '.status': {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  '.status.failed': {
    color: '$error500',
  },
  '.status.success': {
    color: '$success500',
  },
});

const RequestId = styled('div', {
  width: '150px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@md': {
    width: 'auto',
  },
});

const ExtraDetails = styled('div', {
  padding: '0',
  color: '$neutral800',
  fontSize: '$10',
});

const SwapFlowContainer = styled('div', {
  overflowY: 'auto',
  padding: '$8 $4 $2 $4',
});

export type PropTypes = {
  pendingSwap: PendingSwap;
  onCopy: (requestId: string) => void;
  onBack: () => void;
  isCopied: boolean;
  onCancel: (requestId: string) => void;
  onRetry?: () => void;
  date: string;
  previewInputs?: React.ReactNode;
} & SwapMessagesPropTypes;

export function SwapHistory(props: PropTypes) {
  const {
    pendingSwap,
    onBack,
    onCopy,
    isCopied,
    onCancel,
    date,
    onRetry,
    ...extraMessageProps
  } = props;
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <SecondaryPage
      title="Swap Details"
      textField={false}
      onBack={onBack}
      Footer={
        <>
          {pendingSwap?.status === 'running' && (
            <Button
              variant="outlined"
              fullWidth
              type="error"
              onClick={setShowDrawer.bind(null, true)}>
              Cancel
            </Button>
          )}
          {!!onRetry && (
            <Button
              variant="contained"
              fullWidth
              type="primary"
              onClick={onRetry}>
              Try again
            </Button>
          )}
        </>
      }>
      <div>
        <SwapInfoContainer>
          <Row>
            <div className="name">
              Request Id:
              <span
                className="value requestId"
                onClick={onCopy.bind(null, pendingSwap?.requestId)}>
                <RequestId>{pendingSwap?.requestId}</RequestId>
                <Divider size={4} direction="horizontal" />
                <Button type="primary" variant="ghost" size="small">
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              </span>
            </div>
            <div className="name">
              <span className={`value status ${pendingSwap?.status || ''}`}>
                {pendingSwap?.status}
                {pendingSwap?.status === 'running' && (
                  <Spinner size={16} color="primary" />
                )}
              </span>
              <ExtraDetails>{date}</ExtraDetails>
            </div>
          </Row>
        </SwapInfoContainer>
        {/* TODO: It was temporarily removed to find a better solution. 

              <Divider size={16} />*/}
      </div>
      <SwapFlowContainer>
        {extraMessageProps.shortMessage && (
          <SwapMessages {...extraMessageProps} />
        )}

        <Divider size={16} />

        {pendingSwap?.steps.map((step, index) => {
          const key = `step-${index}`;
          return (
            <div key={key}>
              {index === 0 && (
                <RelativeContainer>
                  <StepDetail
                    logo={step.fromLogo}
                    symbol={step.fromSymbol}
                    chainLogo={step.fromBlockchainLogo || ''}
                    blockchain={step.fromBlockchain}
                    amount={pendingSwap.inputAmount}
                  />
                  <Dot />
                </RelativeContainer>
              )}
              <Line />
              <SwapperContainer
                created={step.status === 'created'}
                running={
                  !['created', 'success', 'failed'].includes(step.status)
                }>
                <Image
                  src={step.swapperLogo || ''}
                  alt={step.swapperId}
                  size={20}
                />

                <FeeContainer>
                  <Typography variant="body" size="small">
                    {step.swapperType === 'DEX' ? 'Swap' : 'Bridge'} via{' '}
                    {step.swapperId}
                  </Typography>
                  <Fee>
                    <GasIcon />
                    <Typography variant="body" size="small">
                      &nbsp; ${step.feeInUsd} estimated gas fee
                    </Typography>
                  </Fee>
                </FeeContainer>
              </SwapperContainer>
              <div
                style={{
                  display: 'flex',
                }}>
                <InternalDetailsContainer>
                  <Line />
                  <div className="details">
                    {!!step.explorerUrl && (
                      <div>
                        {step.explorerUrl.map((item, index) => {
                          const internalKey = `internal-${index}`;
                          const anchorKey = `anchor-${index}`;

                          return (
                            <InternalDetail key={internalKey}>
                              <DescriptionContainer>
                                <Divider size={4} />
                                <CheckCircleIcon color="primary" />
                                <Description variant="body" size="small">
                                  <StyledAnchor
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    key={anchorKey}>
                                    {!item.description ? (
                                      <b>View transaction</b>
                                    ) : (
                                      <b>
                                        {item.description
                                          .substring(0, 1)
                                          .toUpperCase()}
                                        {item.description.substring(1)} Tx
                                      </b>
                                    )}
                                  </StyledAnchor>
                                </Description>
                              </DescriptionContainer>
                            </InternalDetail>
                          );
                        })}
                      </div>
                    )}
                    {step.status === 'failed' && (
                      <InternalDetail>
                        <DescriptionContainer>
                          <InfoCircleIcon color="error" />
                          <Description
                            variant="body"
                            size="small"
                            color="$error500">
                            Step failed
                          </Description>
                        </DescriptionContainer>
                      </InternalDetail>
                    )}
                  </div>
                </InternalDetailsContainer>
              </div>
              {index + 1 === pendingSwap.steps.length && <ArrowDown />}
              <StepDetail
                logo={step.toLogo}
                symbol={step.toSymbol}
                chainLogo={step.toBlockchainLogo || ''}
                blockchain={step.toBlockchain}
                amount={step.outputAmount || ''}
                estimatedAmount={step.expectedOutputAmountHumanReadable || ''}
                success={step.status === 'success'}
              />
            </div>
          );
        })}

        <Divider size={32} />
      </SwapFlowContainer>
      <Drawer
        onClose={setShowDrawer.bind(null, false)}
        open={showDrawer}
        anchor="bottom"
        title="Cancel Progress"
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              variant="contained"
              type="success"
              onClick={setShowDrawer.bind(null, false)}>
              Skip
            </Button>
            <Divider size={16} direction="horizontal" />
            <Button
              variant="contained"
              type="error"
              onClick={() => {
                onCancel(pendingSwap.requestId);
                setShowDrawer(false);
              }}>
              Cancel progress
            </Button>
          </div>
        }
        container={document.getElementById('swap-box')}>
        <Alert type="warning">
          <Typography variant="body" size="small">
            Warning: Cancel <u>doesn't revert</u> your transaction if you've
            already signed and sent a transaction to the blockchain. It only
            stops next steps from being executed.
          </Typography>
        </Alert>
      </Drawer>
    </SecondaryPage>
  );
}
