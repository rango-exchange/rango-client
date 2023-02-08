import React from 'react';
import {
  StepDetail,
  Typography,
  GasIcon,
  SecondaryPage,
} from '../../components';
import { BestRouteType } from '../../types/swaps';
import {
  RelativeContainer,
  Dot,
  Line,
  SwapperContainer,
  SwapperLogo,
  Fee,
  ArrowDown,
} from '../ConfirmSwap/ConfirmSwap';

export interface PropTypes {
  bestRoute: BestRouteType;
  onBack: () => void;
}

export function SwapHistory(props: PropTypes) {
  const { bestRoute, onBack } = props;

  return (
    <SecondaryPage
      title="History"
      textField={false}
      onBack={onBack}
      Content={
        <>
          {bestRoute?.result?.swaps.map((swap, index) => (
            <>
              {index === 0 && (
                <RelativeContainer>
                  <StepDetail
                    logo={swap.from.logo}
                    symbol={swap.from.symbol}
                    //@ts-ignore
                    chainLogo={swap.from.blockchainLogo}
                    blockchain={swap.from.blockchain}
                    amount={swap.fromAmount}
                  />
                  <Dot />
                </RelativeContainer>
              )}
              <Line />
              <SwapperContainer>
                <SwapperLogo
                  //@ts-ignore
                  src={swap.swapperLogo}
                  alt={swap.swapperId}
                />
                <div>
                  <Typography ml={4} variant="caption">
                    {swap.swapperType} from {swap.from.symbol} to{' '}
                    {swap.to.symbol} via {swap.swapperId}{' '}
                  </Typography>
                  <Fee>
                    <GasIcon />
                    <Typography ml={4} variant="caption">
                      {parseFloat(swap.fee[0].amount).toFixed(6)} estimated gas
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
                {!!swap.explorerUrl &&
                  swap.explorerUrl.map((item, index) => (
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
              {index + 1 === bestRoute.result?.swaps.length && <ArrowDown />}
              <StepDetail
                logo={swap.to.logo}
                symbol={swap.to.symbol}
                //@ts-ignore
                chainLogo={swap.to.blockchainLogo}
                blockchain={swap.to.blockchain}
                amount={swap.toAmount}
              />
            </>
          ))}
        </>
      }
    />
  );
}
