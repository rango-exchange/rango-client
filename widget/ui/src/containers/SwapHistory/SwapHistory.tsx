import React, { Fragment } from 'react';
import {
  StepDetail,
  SecondaryPage,
  GasIcon,
  Typography,
  CheckCircleIcon,
  InfoCircleIcon,
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

const StyledAnchor = styled('a', {
  color: '$primary',
  fontWeight: '$600',
  marginLeft: '$12',
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
  marginLeft: '$12',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});

export interface PropTypes {
  pendingSwap: PendingSwap;
  onBack: () => void;
}

export function SwapHistory(props: PropTypes) {
  const { pendingSwap, onBack } = props;

  return (
    <SecondaryPage
      title="History"
      textField={false}
      onBack={onBack}
      Content={
        <>
          {pendingSwap?.steps.map((step, index) => (
            <Fragment key={index}>
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
                      {/* {parseFloat(step.fee[0].amount).toFixed(6)} estimated gas */}
                      fee
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
            </Fragment>
          ))}
        </>
      }
    />
  );
}
