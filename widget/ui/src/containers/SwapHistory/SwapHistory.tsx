import React from 'react';
import {
  StepDetail,
  SecondaryPage,
  GasIcon,
  Typography,
} from '../../components';
import {
  RelativeContainer,
  Dot,
  Line,
  SwapperContainer,
  SwapperLogo,
  ArrowDown,
  Fee,
} from '../ConfirmSwap/ConfirmSwap';
import { PendingSwap } from '../History/types';

export interface PropTypes {
  pendingSwap: PendingSwap;
  onBack: () => void;
}

export function SwapHistory(props: PropTypes) {
  const { pendingSwap, onBack } = props;
  console.log(pendingSwap);

  return (
    <SecondaryPage
      title="History"
      textField={false}
      onBack={onBack}
      Content={
        <>
          {pendingSwap?.steps.map((step, index) => (
            <>
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
                    {/* {step.swapperType} from {step.fromSymbol} to {step.toSymbol} */}
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
                <Line />
                {!!step.explorerUrl && (
                  <div>
                    {step.explorerUrl.map((item, index) => (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        key={index}
                      >
                        <div>
                          {!item.description ? (
                            <b>View transaction</b>
                          ) : (
                            <b>
                              {item.description.substring(0, 1).toUpperCase()}
                              {item.description.substring(1)} tx
                            </b>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {index + 1 === pendingSwap.steps.length && <ArrowDown />}
              <StepDetail
                logo={step.toLogo}
                symbol={step.toSymbol}
                //@ts-ignore
                chainLogo={step.toBlockchainLogo}
                blockchain={step.toBlockchain}
                amount={step.outputAmount}
              />
            </>
          ))}
        </>
      }
    />
  );
}
