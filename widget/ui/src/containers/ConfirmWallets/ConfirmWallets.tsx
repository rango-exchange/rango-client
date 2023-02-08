import { BestRouteResponse } from 'rango-sdk';
import React, { PropsWithChildren } from 'react';
import { Button } from '../../components/Button';
import { AddWalletIcon } from '../../components/Icon';
import { SecondaryPage } from '../../components/SecondaryPage/SecondaryPage';
import { SelectableWalletList } from '../../components/SelectableWalletList';
import { Spacer } from '../../components/Spacer';
import { Tooltip } from '../../components/Tooltip';
import { Typography } from '../../components/Typography';
import { decimalNumber } from '../../helper';
import { styled } from '../../theme';
import { SelectableWallet } from './types';

const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export interface PropTypes {
  swap: BestRouteResponse;
  onBack: () => void;
  onAddWallet?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  requiredWallets: string[];
  selectableWallets: SelectableWallet[];
}
export function ConfirmWallets({
  onBack,
  loading,
  onAddWallet,
  onConfirm,
  swap,
  requiredWallets,
  selectableWallets,
}: PropsWithChildren<PropTypes>) {
  const firstStep = swap.result?.swaps[0];
  const lastStep = swap.result?.swaps[swap.result?.swaps.length - 1];

  const fromAmount = decimalNumber(firstStep?.fromAmount, 3);
  const toAmount = decimalNumber(lastStep?.toAmount, 3);

  return (
    <SecondaryPage
      textField={false}
      title="Swap"
      onBack={onBack}
      Footer={
        <Footer>
          <Tooltip side="bottom" content="send to a different wallet">
            <Button
              variant="contained"
              type="primary"
              prefix={<AddWalletIcon size={24} color="white" />}
              onClick={onAddWallet}
            />
          </Tooltip>
          <Spacer />

          <Button
            fullWidth
            loading={loading}
            type="primary"
            variant="contained"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </Footer>
      }
      Content={
        <>
          <Typography variant="h6" mb={12}>
            Confirm swap {fromAmount} {lastStep?.from.symbol} (
            {firstStep?.from.blockchain}) to {toAmount} {lastStep?.to.symbol}{' '}
            (on {lastStep?.to.blockchain})
          </Typography>
          {requiredWallets.map((wallet, index) => {
            return (
              <div key={index}>
                <Typography variant="body2" mb={12} mt={12}>
                  {index + 1}) Your {wallet} Wallet
                </Typography>
                <SelectableWalletList
                  list={selectableWallets.filter(
                    (w) => wallet === w.blockchain
                  )}
                />
              </div>
            );
          })}
        </>
      }
    />
  );
}
