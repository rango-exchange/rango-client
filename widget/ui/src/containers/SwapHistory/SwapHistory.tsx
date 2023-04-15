import React, { useState } from 'react';
import {
  StepDetail,
  SecondaryPage,
  GasIcon,
  Typography,
  CheckCircleIcon,
  InfoCircleIcon,
  CopyIcon,
  Spacer,
  CheckSquareIcon,
  Button,
  Alert,
  Drawer,
} from '../../components';
import { styled } from '../../theme';
import {
  RelativeContainer,
  Dot,
  SwapperContainer,
  SwapperLogo,
  ArrowDown,
  Fee,
} from '../ConfirmSwap/ConfirmSwap';
import { PendingSwap } from '../History/types';
import { pulse } from '../../components/BestRoute/BestRoute';
import {
  SwapMessages,
  PropTypes as SwapMessagesPropTypes,
} from './SwapMessages';

const StyledAnchor = styled('a', {
  color: '$primary',
  fontWeight: '$600',
  marginLeft: '$12',
});

const SwapInfoContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  marginBottom: '16px',
  flexDirection: 'column',
});

const InternalDetailsContainer = styled('div', {
  display: 'flex',
});

const InternalDetail = styled('div', {
  display: 'flex',
  padding: '$10',
});

const DescriptionContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const Description = styled(Typography, {
  color: '$success',
  marginLeft: '$8',
});

const Error = styled(Description, {
  color: '$error',
});

export const Line = styled('div', {
  width: '0',
  minHeight: '$16',
  marginLeft: '$12',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});

const RequestIdContainer = styled('div', {
  '.requestId': {
    cursor: 'pointer',
    backgroundColor: '$neutrals200',
    padding: '$4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$5',
  },
});

const RequestId = styled(Typography, {
  width: '200px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '$primary !important',
  '@sm': {
    width: 'auto',
  },
});

const CancelButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StepContainer = styled('div', {
  variants: {
    hasNotStarted: {
      true: {
        filter: 'grayscale(100%)',
      },
    },
    isRunning: {
      true: {
        animation: `${pulse} 2s ease-in-out infinite`,
      },
    },
  },
});

const SwapStatusContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '$8',
});

const SwapStatus = styled(Typography, {
  fontWeight: '$600',
  variants: {
    status: {
      running: {
        color: '$primary !important',
      },
      success: {
        color: '$success500 !important',
      },
      failed: { color: '$error500 !important' },
    },
  },
});

const DateContainer = styled('div', { paddingBottom: '$8' });

type PropTypes = {
  pendingSwap: PendingSwap;
  onCopy: (requestId: string) => void;
  onBack: () => void;
  isCopied: boolean;
  onCancel: (requestId: string) => void;
  onRetry?: () => void;
  date: string;
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
    <SecondaryPage title="Swap Details" textField={false} onBack={onBack}>
      <div style={{ overflow: 'hidden' }}>
        <SwapInfoContainer>
          <RequestIdContainer
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <Typography variant="body1"> Request ID :</Typography>
            <div
              className="requestId"
              onClick={onCopy.bind(null, pendingSwap?.requestId)}
            >
              <RequestId variant="body1">{pendingSwap?.requestId}</RequestId>
              <Spacer size={12} />
              {isCopied ? (
                <CheckSquareIcon color="success" size={18} />
              ) : (
                <CopyIcon color="primary" size={18} />
              )}
            </div>
          </RequestIdContainer>
          <SwapStatusContainer>
            <div>
              <Typography variant="body1">Status:</Typography>
              &nbsp;
              <SwapStatus variant="body1" status={pendingSwap?.status}>
                {pendingSwap?.status}
              </SwapStatus>
            </div>
            {pendingSwap?.status === 'running' && (
              <CancelButtonContainer>
                <Button
                  variant="contained"
                  size="small"
                  type="error"
                  onClick={setShowDrawer.bind(null, true)}
                >
                  Cancel
                </Button>
              </CancelButtonContainer>
            )}
            {!!onRetry && (
              <CancelButtonContainer>
                <Button
                  variant="contained"
                  size="small"
                  type="primary"
                  onClick={onRetry}
                >
                  Try again
                </Button>
              </CancelButtonContainer>
            )}
          </SwapStatusContainer>
          <DateContainer>
            <Typography variant="body2">{date}</Typography>
          </DateContainer>
          {extraMessageProps.shortMessage && (
            <SwapMessages {...extraMessageProps} />
          )}
        </SwapInfoContainer>
        <div style={{ overflow: 'auto', position: 'relative' }}>
          {pendingSwap?.steps.map((step, index) => (
            <StepContainer
              key={index}
              hasNotStarted={step.status === 'created'}
              isRunning={
                step.status != 'failed' &&
                step.status != 'success' &&
                step.status != 'created'
              }
            >
              {index === 0 && (
                <RelativeContainer>
                  <StepDetail
                    logo={step.fromLogo}
                    symbol={step.fromSymbol}
                    chainLogo={step.fromBlockchainLogo}
                    blockchain={step.fromBlockchain}
                    amount={pendingSwap.inputAmount}
                  />
                  <Dot />
                </RelativeContainer>
              )}
              <Line />
              <SwapperContainer>
                <SwapperLogo src={step.swapperLogo} alt={step.swapperId} />
                <div>
                  <Typography ml={4} variant="caption">
                    {step.swapperType} from {step.fromSymbol} to {step.toSymbol}
                    via {step.swapperId}
                  </Typography>
                  <Fee>
                    <GasIcon />
                    <Typography ml={4} variant="caption">
                      ${step.feeInUsd} estimated gas fee
                    </Typography>
                  </Fee>
                </div>
              </SwapperContainer>
              <div
                style={{
                  display: 'flex',
                }}
              >
                <InternalDetailsContainer>
                  <Line />
                  {!!step.explorerUrl && (
                    <div>
                      {step.explorerUrl.map((item, index) => (
                        <InternalDetail key={index}>
                          <DescriptionContainer>
                            <CheckCircleIcon color="success" />
                            <Description variant="body2">
                              {!item.description ? (
                                <b>View transaction</b>
                              ) : (
                                <b>
                                  {item.description
                                    .substring(0, 1)
                                    .toUpperCase()}
                                  {item.description.substring(1)}
                                </b>
                              )}
                            </Description>
                          </DescriptionContainer>
                          <StyledAnchor
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            key={index}
                          >
                            TX-Link
                          </StyledAnchor>
                        </InternalDetail>
                      ))}
                      {step.status === 'failed' && (
                        <InternalDetail>
                          <DescriptionContainer>
                            <InfoCircleIcon color="error" />
                            <Error variant="body2">Step failed</Error>
                          </DescriptionContainer>
                        </InternalDetail>
                      )}
                    </div>
                  )}
                </InternalDetailsContainer>
              </div>
              {index + 1 === pendingSwap.steps.length && <ArrowDown />}
              <StepDetail
                logo={step.toLogo}
                symbol={step.toSymbol}
                chainLogo={step.toBlockchainLogo}
                blockchain={step.toBlockchain}
                amount={step.outputAmount}
              />
            </StepContainer>
          ))}
        </div>
      </div>
      <Drawer
        onClose={setShowDrawer.bind(null, false)}
        open={showDrawer}
        showClose={true}
        anchor="bottom"
        title="Cancel Progress"
        content={
          <Alert type="warning">
            <p>
              Warning: Rango <u>neither reverts</u> your transaction&nbsp;
              <u>nor refunds</u> you if you've already signed and sent a
              transaction to the blockchain since it's out of Rango's control.
              Beware that "Cancel" only stops next steps from being executed.
            </p>
            <Spacer size={12} direction="vertical" />
            <p>
              If you have already signed your transaction to blockchain, you
              should wait for that to complete or rollback
            </p>
          </Alert>
        }
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              type="success"
              onClick={setShowDrawer.bind(null, false)}
            >
              Skip
            </Button>
            <Spacer size={16} />
            <Button
              variant="contained"
              type="error"
              onClick={() => {
                onCancel(pendingSwap.requestId);
                setShowDrawer(false);
              }}
            >
              Cancel progress
            </Button>
          </div>
        }
        container={document.getElementById('swap-box')!}
      />
    </SecondaryPage>
  );
}
