/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Wallet } from '../../types';
import type { WalletType } from '@rango-dev/wallets-shared';

import {
  Button,
  Divider,
  MessageBox,
  Modal,
  SelectableWallet,
  Typography,
  WalletState,
} from '@rango-dev/ui';
import { KEPLR_COMPATIBLE_WALLETS } from '@rango-dev/wallets-shared';
import React, { useState } from 'react';

import { useWallets, type WidgetConfig } from '../..';
import { useWalletList } from '../../hooks/useWalletList';
import { TIME_TO_CLOSE_MODAL } from '../../pages/WalletsPage';
import { useMetaStore } from '../../store/meta';
import { useWalletsStore } from '../../store/wallets';
import {
  getAddress,
  getConciseAddress,
  isExperimentalChain,
} from '../../utils/wallets';
import { WalletModal } from '../WalletModal';

import { WalletButton } from './ConfirmWallets.styles';

type PropTypes = {
  chain: string;
  supportedWallets: WidgetConfig['wallets'];
  isSelected: (walletType: string, chain: string) => boolean;
  selectWallet: (wallet: Wallet) => void;
  multiWallets: boolean;
  config?: WidgetConfig;
  limit?: number;
  onShowMore: () => void;
};

export function WalletList(props: PropTypes) {
  const {
    supportedWallets,
    multiWallets,
    config,
    chain,
    isSelected,
    selectWallet,
    limit,
    onShowMore,
  } = props;

  const connectedWallets = useWalletsStore.use.connectedWallets();
  const { blockchains } = useMetaStore.use.meta();
  const [openWalletStateModal, setOpenWalletStateModal] =
    useState<WalletType>('');
  const [experimentalChainWallet, setExperimentalChainWallet] =
    useState<Wallet | null>(null);
  const [showExperimentalChainModal, setShowExperimentalChainModal] =
    useState(false);
  const { connect } = useWallets();
  const { list, error, handleClick } = useWalletList({
    supportedWallets,
    multiWallets,
    config,
    chain,
    onBeforeConnect: setOpenWalletStateModal,
    onConnect: () =>
      setTimeout(() => setOpenWalletStateModal(''), TIME_TO_CLOSE_MODAL),
  });
  const numberOfSupportedWallets = list.length;
  const shouldShowMoreWallets = limit && numberOfSupportedWallets - limit > 0;

  const addExperimentalChain = async (wallet: Wallet) => {
    setExperimentalChainWallet(null);
    setShowExperimentalChainModal(false);
    await connect(wallet.walletType, wallet.chain);
    selectWallet({
      walletType: wallet.walletType,
      chain,
      address: wallet.address ?? '',
    });
  };

  return (
    <>
      {list.slice(0, limit).map((wallet) => {
        const address = getAddress({
          connectedWallets,
          walletType: wallet.type,
          chain,
        });
        const conciseAddress = address ? getConciseAddress(address) : '';

        const experimentalChain =
          KEPLR_COMPATIBLE_WALLETS.includes(wallet.type) &&
          isExperimentalChain(blockchains, chain);

        const experimentalChainNotAdded =
          wallet.state === WalletState.CONNECTED &&
          !connectedWallets.find(
            (connectedWallet) =>
              connectedWallet.walletType === wallet.type &&
              connectedWallet.chain === chain
          );

        const couldAddExperimentalChain =
          experimentalChain && experimentalChainNotAdded;

        const connectedWalletDescription = couldAddExperimentalChain
          ? `Add ${chain} chain`
          : conciseAddress;

        const onClick = async () => {
          if (wallet.state === WalletState.DISCONNECTED) {
            await handleClick(wallet.type);
            if (!couldAddExperimentalChain) {
              selectWallet({
                walletType: wallet.type,
                chain,
                address: address ?? '',
              });
            }
          } else if (couldAddExperimentalChain) {
            setExperimentalChainWallet({
              walletType: wallet.type,
              chain,
              address: address ?? '',
            });
            setShowExperimentalChainModal(true);
          } else {
            selectWallet({
              walletType: wallet.type,
              chain,
              address: address ?? '',
            });
          }
        };

        return (
          <>
            {openWalletStateModal === wallet.type && (
              <WalletModal
                open={openWalletStateModal === wallet.type}
                onClose={() => setOpenWalletStateModal('')}
                image={wallet.image}
                state={wallet.state}
                error={!!error}
              />
            )}
            <SelectableWallet
              key={wallet.type}
              description={connectedWalletDescription}
              onClick={onClick}
              selected={isSelected(wallet.type, chain)}
              {...wallet}
            />
          </>
        );
      })}
      {shouldShowMoreWallets && (
        <WalletButton selected={false} onClick={onShowMore.bind(null)}>
          <Typography variant="label" size="medium">
            Show more wallet
            <Typography variant="label" size="medium" color="$primary">
              &nbsp;+{numberOfSupportedWallets - (limit ?? 0)}
            </Typography>
          </Typography>
        </WalletButton>
      )}
      {!!experimentalChainWallet && (
        <Modal
          open={!!experimentalChainWallet && showExperimentalChainModal}
          container={document.querySelector('#swap-box') as HTMLDivElement}
          onClose={() => {
            setShowExperimentalChainModal(false);
            setExperimentalChainWallet(null);
          }}>
          <MessageBox
            title={`Add ${experimentalChainWallet.chain} Chain`}
            type="warning"
            description={`You should connect a ${experimentalChainWallet.chain} supported wallet or choose a different ${experimentalChainWallet.chain} address`}>
            <Divider size={18} />
            <Divider size={32} />
            <Button
              onClick={addExperimentalChain.bind(null, experimentalChainWallet)}
              variant="outlined"
              type="primary"
              fullWidth
              size="large">
              Confirm
            </Button>
          </MessageBox>
        </Modal>
      )}
    </>
  );
}
