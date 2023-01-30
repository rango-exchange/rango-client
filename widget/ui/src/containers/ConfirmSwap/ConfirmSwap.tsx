import React, { PropsWithChildren } from 'react';
import { Button } from '../../components/Button';
import { RetryIcon, GasIcon, AddWalletIcon } from '../../components/Icon';
import { SecondaryPage } from '../../components/SecondaryPage/';
import { Spacer } from '../../components/Spacer';
import { StepDetail } from '../../components/StepDetail';
import { Tooltip } from '../../components/Tooltip';
import { Typography } from '../../components/Typography';
import { styled } from '../../theme';
import { SwapResult } from '../../types/swaps';
import { BestRouteType } from '../../types/swaps';

const Line = styled('div', {
  width: '0',
  marginLeft: '$12',
  height: '36px',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});
const SwapperContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '6px',
});
const BodyError = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const ErrorMsg = styled(Typography, {
  color: '$error',
});
const Fee = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
const SwapperLogo = styled('img', {
  width: '$16',
  height: '$16',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});

const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
const Dot = styled('div', {
  width: '$8',
  height: '$8',
  backgroundColor: '$foreground',
  borderRadius: '4px',
  marginLeft: '$8',
});
const ArrowDown = styled('div', {
  width: '0px',
  height: '0px',
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid $foreground',
  marginLeft: '$8',
});
const UpdateIcon = styled(RetryIcon, {
  position: 'absolute',
  right: '0',
});
const StyledUpdateIcon = styled(UpdateIcon, {
  cursor: 'pointer',
});

export interface PropTypes {
  swap: BestRouteType;
  onRefresh?: React.MouseEventHandler<SVGElement>;
  onBack?: () => void;
  onAddWallet?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  error?: string;
}
export function ConfirmSwap({
  swap,
  onRefresh,
  onBack,
  onAddWallet,
  onConfirm,
  loading,
  error,
}: PropsWithChildren<PropTypes>) {
  return (
    <SecondaryPage
      textField={false}
      title="Swap"
      onBack={onBack}
      Footer={
        <Footer>
          <Tooltip side="bottom" content="send to a different wallet">
            <Button
              type="primary"
              variant="contained"
              prefix={<AddWalletIcon size={24} color="white" />}
              onClick={onAddWallet}
            />
          </Tooltip>
          <Spacer />

          <Button
            type="primary"
            fullWidth
            loading={loading}
            variant="contained"
            onClick={onConfirm}
          >
            Swap
          </Button>
        </Footer>
      }
      TopButton={<StyledUpdateIcon size={24} onClick={onRefresh} />}
      Content={
        error ? (
          <BodyError>
            <ErrorMsg variant="caption">{error}</ErrorMsg>
          </BodyError>
        ) : (
          swap.result?.swaps.map((swap: SwapResult, index: number) => (
            <>
              {index === 0 && (
                <RelativeContainer>
                  <StepDetail
                    logo={swap.from.logo}
                    symbol={swap.from.symbol}
                    chainLogo={swap.from.blockchainlogo}
                    blockchain={swap.from.blockchain}
                    amount={swap.fromAmount}
                  />
                  <Dot />
                </RelativeContainer>
              )}
              <Line />
              <SwapperContainer>
                <SwapperLogo src={swap.swapperLogo} alt={swap.swapperId} />
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
              <Line />
              {index + 1 === swap.result?.swaps.length && <ArrowDown />}
              <StepDetail
                logo={swap.to.logo}
                symbol={swap.to.symbol}
                chainLogo={swap.to.blockchainlogo}
                blockchain={swap.to.blockchain}
                amount={swap.toAmount}
              />
            </>
          ))
        )
      }
    />
  );
}
