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
  Image,
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
  color: '$error',
});

export const FeeContainer = styled('div', {
  paddingLeft: '$16',
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
  color: '$primary',
  fontWeight: '$600'
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
  paddingLeft: '$20',
  paddingBottom: '$4',
});

const DescriptionContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const Description = styled(Typography, {
  color: '$success'
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
    color: '$neutrals600',
  },
  '.value': {
    display: 'flex',
    alignItems: 'center',
    color: '$neutrals800',
    justifyContent: 'flex-end',
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
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@md': {
    width: 'auto',
  },
});

const ExtraDetails = styled('div', {
  padding: '0',
  color: '$neutrals600',
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
            <div className="name">Request Id:
              <span
                className="value requestId"
                onClick={onCopy.bind(null, pendingSwap?.requestId)}>
                <RequestId>{pendingSwap?.requestId}</RequestId>
                <Spacer size={4} />
                <Button type="primary" variant="ghost" size="compact">
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
        {/*{previewInputs} */}

        {extraMessageProps.shortMessage && (
          <SwapMessages {...extraMessageProps} />
        )}

        <Divider size={16} />

        {pendingSwap?.steps.map((step, index) => (
          <div key={index}>
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
              running={!['created', 'success', 'failed'].includes(step.status)}
            >
              <Image
                src={step.swapperLogo || ''}
                alt={step.swapperId}
                size={20}
              />

              <FeeContainer>
                <Typography variant="caption">
                  {step.swapperType === 'DEX' ? 'Swap' : 'Bridge'} via {step.swapperId}
                </Typography>
                <Fee>
                  <GasIcon />
                  <Typography variant="caption">
                    &nbsp; ${step.feeInUsd} estimated gas fee
                  </Typography>
                </Fee>
              </FeeContainer>
            </SwapperContainer>
            <div
              style={{
                display: 'flex',
              }}
            >
              <InternalDetailsContainer>
                <Line />
                <div>
                  {!!step.explorerUrl && (
                    <div>
                      {step.explorerUrl.map((item, index) => (
                        <InternalDetail key={index}>
                          <DescriptionContainer>
                            <Divider size={4} />
                            <CheckCircleIcon color="primary" />
                            <Description variant="body3">
                              <StyledAnchor
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                key={index}
                              >
                                {/* <CheckCircleIcon color="success" /> */}
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
                      ))}
                    </div>
                  )}
                  {step.status === 'failed' && (
                    <InternalDetail>
                      <DescriptionContainer>
                        <InfoCircleIcon color="error" />
                        <Description variant="body3" color="$error500">
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
            <Typography variant='body2'>
              Warning: Cancel <u>doesn't revert</u> your transaction if you've already signed and sent a
              transaction to the blockchain. It only stops next steps from being executed.
            </Typography>
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
