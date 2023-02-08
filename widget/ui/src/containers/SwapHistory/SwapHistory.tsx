import React from 'react';
import { StepDetail, SecondaryPage } from '../../components';
import {
  RelativeContainer,
  Dot,
  Line,
  SwapperContainer,
  SwapperLogo,
  ArrowDown,
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
                  {/* <Typography ml={4} variant="caption">
                    {step.swapperType} from {step.from.symbol} to{' '}
                    {step.to.symbol} via {step.swapperId}{' '}
                  </Typography>
                  <Fee>
                    <GasIcon />
                    <Typography ml={4} variant="caption">
                      {parseFloat(step.fee[0].amount).toFixed(6)} estimated gas
                      fee
                    </Typography>
                  </Fee> */}
                </div>
              </SwapperContainer>
              <div
                style={{
                  display: 'flex',
                }}
              >
                <Line />
                {!!step.explorerUrl &&
                  step.explorerUrl.map((item, index) => (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      key={index}
                    >
                      <div className="mt-1.5 rounded-sm bg-gray-700 p-0.5 hover:bg-gray-600">
                        {!item.description ? (
                          <b>View transaction</b>
                        ) : (
                          <b>
                            {item.description.substr(0, 1).toUpperCase()}
                            {item.description.substr(1)} tx
                          </b>
                        )}
                      </div>
                    </a>
                  ))}
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
