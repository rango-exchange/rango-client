import {
  getCosmosExperimentalChainInfo,
  Network,
  WalletType,
  KEPLR_COMPATIBLE_WALLETS,
} from '@rango-dev/wallets-shared';
import {
  BestRouteResponse,
  BlockchainMeta,
  isCosmosBlockchain,
} from 'rango-sdk';
import React, { PropsWithChildren } from 'react';
import { Alert } from '../../components';
import { Button } from '../../components/Button';
import { SecondaryPage } from '../../components/SecondaryPage/SecondaryPage';
import { SelectableWalletList } from '../../components/SelectableWalletList';
import { Typography } from '../../components/Typography';
import { decimalNumber, getConnectedWalletTypes } from '../../helper';
import { styled } from '../../theme';
import { SelectableWallet } from './types';

const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const AlertContainer = styled('div', {
  padding: '$16 0',
});

export interface PropTypes {
  swap: BestRouteResponse;
  onBack: () => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  confirmDisabled?: boolean;
  loading?: boolean;
  requiredWallets: string[];
  selectableWallets: SelectableWallet[];
  onChange: (w: SelectableWallet) => void;
  blockchains?: BlockchainMeta[];
  connect?: (type: WalletType, network?: Network) => Promise<any>;
}
export function ConfirmWallets({
  onBack,
  loading,
  onConfirm,
  swap,
  requiredWallets,
  selectableWallets,
  onChange,
  confirmDisabled,
  blockchains,
  connect,
}: PropsWithChildren<PropTypes>) {
  const firstStep = swap.result?.swaps[0];
  const lastStep = swap.result?.swaps[swap.result?.swaps.length - 1];

  const fromAmount = decimalNumber(firstStep?.fromAmount, 3);
  const toAmount = decimalNumber(lastStep?.toAmount, 3);

  const cosmosExperimentalChainInfo = blockchains
    ? getCosmosExperimentalChainInfo(
        Object.entries(blockchains)
          .map(([, blockchainMeta]) => blockchainMeta)
          .filter(isCosmosBlockchain)
      )
    : {};

  const keplrCompatibleConnectedWallets = KEPLR_COMPATIBLE_WALLETS.filter(
    (compatibleWallet) =>
      getConnectedWalletTypes(selectableWallets).has(compatibleWallet)
  );

  return (
    <SecondaryPage
      textField={false}
      title="Confirm Swap"
      onBack={onBack}
      Footer={
        <Footer>
          <Button
            fullWidth
            loading={loading}
            type="primary"
            variant="contained"
            onClick={onConfirm}
            disabled={confirmDisabled}
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
            const list = selectableWallets.filter((w) => wallet === w.chain);
            return (
              <div key={index}>
                <Typography variant="body2" mb={12} mt={12}>
                  {index + 1}) Your {wallet} Wallet
                </Typography>
                {list.length === 0 && (
                  <>
                    <AlertContainer>
                      <Alert
                        type="error"
                        description={`You should connect a ${wallet} supported wallet`}
                      />
                    </AlertContainer>
                    {keplrCompatibleConnectedWallets.length > 0 &&
                      !!cosmosExperimentalChainInfo &&
                      cosmosExperimentalChainInfo[wallet] && (
                        <Button
                          variant="contained"
                          type="primary"
                          align="grow"
                          onClick={() => {
                            const network = wallet as Network;
                            keplrCompatibleConnectedWallets.forEach(
                              (compatibleWallet: WalletType) =>
                                connect?.(compatibleWallet, network)
                            );
                          }}
                        >
                          {keplrCompatibleConnectedWallets.length === 1
                            ? `Add ${wallet} chain to ${keplrCompatibleConnectedWallets[0]}`
                            : `Add ${wallet} chain to Cosmos wallets`}
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
      }
    />
  );
}
