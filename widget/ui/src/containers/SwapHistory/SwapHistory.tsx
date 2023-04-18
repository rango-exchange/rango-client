import React, { useState } from 'react';
import {
  StepDetail,
  SecondaryPage,
  GasIcon,
  Typography,
  CheckCircleIcon,
  InfoCircleIcon,
  Spacer,
  Button,
  Alert,
  Drawer,
  Spinner,
  Divider,
} from '../../components';
import { styled } from '../../theme';
import { PendingSwap } from '../History/types';
import { pulse } from '../../components/BestRoute/BestRoute';
import {
  SwapMessages,
  PropTypes as SwapMessagesPropTypes,
} from './SwapMessages';

export const SwapperContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '6px',
});

export const BodyError = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorMsg = styled(Typography, {
  color: '$error',
});

export const Fee = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const SwapperLogo = styled('img', {
  width: '$16',
  height: '$16',
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
  marginLeft: '$8',
});

export const ArrowDown = styled('div', {
  width: '0px',
  height: '0px',
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid $foreground',
  marginLeft: '$8',
});

const StyledAnchor = styled('a', {
  color: '$primary',
  fontWeight: '$600',
  marginLeft: '$12',
});

const SwapInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '$16',
  borderBottom: '1px solid $neutrals300',
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

const Row = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '$14',
  padding: '$8 0',

  '.name': {
    color: '$neutrals600',
  },
  '.value': {
    display: 'flex',
    alignItems: 'center',
    color: '$neutrals800',
  },
  '.status': {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  '.status.failed': {
    color: '$error',
  },
  '.status.success': {
    color: '$success',
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
  padding: '$8 0',
  color: '$neutrals600',
  fontSize: '$12',
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

const SwapFlowContainer = styled('div', {
  overflowY: 'auto',
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
    previewInputs,
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
              onClick={setShowDrawer.bind(null, true)}
            >
              Cancel
            </Button>
          )}
          {!!onRetry && (
            <Button
              variant="contained"
              fullWidth
              type="primary"
              onClick={onRetry}
            >
              Try again
            </Button>
          )}
        </>
      }
    >
      <div>
        <SwapInfoContainer>
          <Row>
            <div className="name">Request ID:</div>
            <div
              className="value requestId"
              onClick={onCopy.bind(null, pendingSwap?.requestId)}
            >
              <RequestId>{pendingSwap?.requestId}</RequestId>
              <Spacer size={4} />
              <Button type="primary" variant="ghost" size="compact">
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </Row>
          <Row>
            <div className="name">Status:</div>
            <div className={`value status ${pendingSwap?.status || ''}`}>
              {pendingSwap?.status}
              {pendingSwap?.status === 'running' && (
                <Spinner size={16} color="primary" />
              )}
            </div>
          </Row>
          <ExtraDetails>{date}</ExtraDetails>
        </SwapInfoContainer>
        {/* TODO: It was temporarily removed to find a better solution. 

              <Divider size={16} />*/}
      </div>
      <SwapFlowContainer>
        {/*{previewInputs} */}

        {extraMessageProps.shortMessage && (
          <SwapMessages {...extraMessageProps} />
        )}

        <Divider size={32} />

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
                  chainLogo={step.fromBlockchainLogo || ''}
                  blockchain={step.fromBlockchain}
                  amount={pendingSwap.inputAmount}
                />
                <Dot />
              </RelativeContainer>
            )}
            <Line />
            <SwapperContainer>
              <SwapperLogo
                src={step.swapperLogo || ''}
                alt={step.swapperId}
              />
              <div>
                <Typography ml={4} variant="caption">
                  {
                    step.swapperType
                  }{' '}
                  from {step.fromSymbol} to {step.toSymbol}
                  via {step.swapperId}
                </Typography>
                <Fee>
                  <GasIcon />
                  <Typography ml={4} variant="caption">
                    $
                    {
                      step.feeInUsd
                    }{' '}
                    estimated gas fee
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
                                {item.description.substring(0, 1).toUpperCase()}
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
              chainLogo={step.toBlockchainLogo || ''}
              blockchain={step.toBlockchain}
              amount={step.outputAmount || ''}
            />
          </StepContainer>
        ))}

        <Divider size={32} />
      </SwapFlowContainer>
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
