import { BestRouteResponse } from 'rango-sdk';
import React, { PropsWithChildren } from 'react';
import { Alert } from '../../components';
import { Button } from '../../components/Button';
import { SecondaryPage } from '../../components/SecondaryPage/SecondaryPage';
import { SelectableWalletList } from '../../components/SelectableWalletList';
import { Typography } from '../../components/Typography';
import { styled } from '../../theme';
import { SelectableWallet } from '../../types';

const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const AlertContainer = styled('div', {
  padding: '$16 0',
});

const ConfirmButton = styled(Button, {
  marginTop: '$16',
});

export interface PropTypes {
  swap: BestRouteResponse | null;
  fromAmount: string;
  toAmount: string;
  onBack: () => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  confirmDisabled?: boolean;
  loading?: boolean;
  requiredWallets: string[];
  selectableWallets: SelectableWallet[];
  onChange: (w: SelectableWallet) => void;
  isExperimentalChain?: (wallet: string) => boolean;
  handleConnectChain?: (wallet: string) => void;
}
export function ConfirmWallets(props: PropsWithChildren<PropTypes>) {
  const {
    onBack,
    loading,
    onConfirm,
    swap,
    requiredWallets,
    selectableWallets,
    onChange,
    confirmDisabled,
    isExperimentalChain,
    handleConnectChain,
    fromAmount,
    toAmount,
  } = props;

  const firstStep = swap?.result?.swaps[0];
  const lastStep = swap?.result?.swaps[swap.result?.swaps.length - 1];

  return (
    <SecondaryPage
      textField={false}
      title="Confirm Swap"
      onBack={onBack}
      Footer={
        <Footer>
          <ConfirmButton
            fullWidth
            loading={loading}
            type="primary"
            variant="contained"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            Confirm
          </ConfirmButton>
        </Footer>
      }
    >
      <>
        <Typography variant="h6" mb={12}>
          Confirm swap {fromAmount} {firstStep?.from.symbol} (
          {firstStep?.from.blockchain}) to {toAmount} {lastStep?.to.symbol} (on
          {lastStep?.to.blockchain})
        </Typography>
        {requiredWallets.map((wallet, index) => {
          const list = selectableWallets.filter((w) => wallet === w.chain);
          return (
            <div key={index}>
              <Typography variant="body2" mb={12} mt={12}>
                {index + 1}) Your {wallet} Wallet
              </Typography>
              {list.length === 0 && (
                <>
                  <AlertContainer>
                    <Alert type="error">
                      You should connect a {wallet} supported wallet
                    </Alert>
                  </AlertContainer>
                  {isExperimentalChain?.(wallet) && (
                    <Button
                      variant="contained"
                      type="primary"
                      align="grow"
                      onClick={() => handleConnectChain?.(wallet)}
                    >
                      {`Add ${wallet} chain to Cosmos wallets`}
                    </Button>
                  )}
                </>
              )}
              {list.length != 0 && (
                <SelectableWalletList list={list} onChange={onChange} />
              )}
            </div>
          );
        })}
      </>
    </SecondaryPage>
  );
}
