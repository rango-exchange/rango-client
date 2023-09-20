/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './WalletList.type';
import type { Wallet } from '../../types';
import type { WalletInfo } from '@rango-dev/ui';
import type { WalletType } from '@rango-dev/wallets-shared';

import {
  BottomLogo,
  Button,
  Divider,
  Image,
  MessageBox,
  Modal,
  SelectableWallet,
  Typography,
  WalletState,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { useWallets } from '../..';
import { useWalletList } from '../../hooks/useWalletList';
import { TIME_TO_CLOSE_MODAL } from '../../pages/WalletsPage';
import { useMetaStore } from '../../store/meta';
import { useWalletsStore } from '../../store/wallets';
import { getBlockchainDisplayNameFor } from '../../utils/meta';
import {
  getAddress,
  getConciseAddress,
  isExperimentalChain,
} from '../../utils/wallets';
import { WalletModal } from '../WalletModal';

import { WalletButton } from './ConfirmWallets.styles';
import {
  LogoContainer,
  Spinner,
  WalletImageContainer,
} from './WalletList.styles';

export function WalletList(props: PropTypes) {
  const { config, chain, isSelected, selectWallet, limit, onShowMore } = props;

  const connectedWallets = useWalletsStore.use.connectedWallets();
  const { blockchains } = useMetaStore.use.meta();
  const [openWalletStateModal, setOpenWalletStateModal] =
    useState<WalletType>('');
  const [experimentalChainWallet, setExperimentalChainWallet] =
    useState<Wallet | null>(null);
  const [showExperimentalChainModal, setShowExperimentalChainModal] =
    useState(false);
  const [addingExperimentalChainStatus, setAddingExperimentalChainStatus] =
    useState<'in-progress' | 'completed' | null>(null);
  const { connect } = useWallets();
  const { list, error, handleClick } = useWalletList({
    config,
    chain,
    onBeforeConnect: setOpenWalletStateModal,
    onConnect: () =>
      setTimeout(() => setOpenWalletStateModal(''), TIME_TO_CLOSE_MODAL),
  });
  const [sortedList, setSortedList] = useState<WalletInfo[]>(list);
  const numberOfSupportedWallets = list.length;
  const shouldShowMoreWallets = limit && numberOfSupportedWallets - limit > 0;

  const addExperimentalChain = async (wallet: Wallet) => {
    setShowExperimentalChainModal(false);
    setAddingExperimentalChainStatus('in-progress');
    await connect(wallet.walletType, wallet.chain);
    setAddingExperimentalChainStatus('completed');
  };

  useEffect(() => {
    setSortedList((sortedList) => {
      const selectedWalletIndex = list.findIndex((wallet) =>
        isSelected(wallet.type, chain)
      );

      if (shouldShowMoreWallets && selectedWalletIndex > 1) {
        return [list[selectedWalletIndex]].concat(
          list.filter((_, index) => index !== selectedWalletIndex)
        );
      }
      return sortedList.map(
        (sortedItem) =>
          list.find((listItem) => listItem.type === sortedItem.type) ??
          sortedItem
      );
    });
  }, [JSON.stringify(list)]);

  const modalContainer = document.querySelector('#swap-box') as HTMLDivElement;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (addingExperimentalChainStatus === 'completed') {
      timeout = setTimeout(
        () => setAddingExperimentalChainStatus(null),
        TIME_TO_CLOSE_MODAL
      );
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [addingExperimentalChainStatus]);

  return (
    <>
      {sortedList.slice(0, limit).map((wallet) => {
        const address = getAddress({
          connectedWallets,
          walletType: wallet.type,
          chain,
        });
        const conciseAddress = address ? getConciseAddress(address) : '';

        const experimentalChain = isExperimentalChain(blockchains, chain);

        const experimentalChainNotAdded = !connectedWallets.find(
          (connectedWallet) =>
            connectedWallet.walletType === wallet.type &&
            connectedWallet.chain === chain
        );

        const couldAddExperimentalChain =
          experimentalChain &&
          experimentalChainNotAdded &&
          wallet.state === WalletState.CONNECTED;

        const connectedWalletDescription = couldAddExperimentalChain
          ? `Add ${chain} chain`
          : conciseAddress;

        const onClick = () => {
          if (wallet.state === WalletState.DISCONNECTED) {
            void handleClick(wallet.type);
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

        const blockchainDisplayName: string | undefined =
          experimentalChainWallet?.chain
            ? getBlockchainDisplayNameFor(
                experimentalChainWallet.chain,
                blockchains
              )
            : undefined;
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
            {!!experimentalChainWallet && (
              <Modal
                open={!!experimentalChainWallet && showExperimentalChainModal}
                container={modalContainer}
                onClose={() => {
                  setExperimentalChainWallet(null);
                }}>
                <MessageBox
                  title={`Add ${blockchainDisplayName} Chain`}
                  type="warning"
                  description={`You should connect a ${blockchainDisplayName} supported wallet or choose a different ${blockchainDisplayName} address`}>
                  <Divider size={18} />
                  <Divider size={32} />
                  <Button
                    onClick={addExperimentalChain.bind(
                      null,
                      experimentalChainWallet
                    )}
                    variant="outlined"
                    type="primary"
                    fullWidth
                    size="large">
                    Confirm
                  </Button>
                  <Divider size={12} />
                  <BottomLogo />
                </MessageBox>
              </Modal>
            )}
            {addingExperimentalChainStatus && (
              <Modal
                open={!!addingExperimentalChainStatus}
                onClose={setAddingExperimentalChainStatus.bind(null, null)}
                container={modalContainer}>
                {addingExperimentalChainStatus === 'in-progress' ? (
                  <MessageBox
                    type="loading"
                    title={`Add ${blockchainDisplayName} Chain`}
                    description={`You should connect a ${blockchainDisplayName} supported wallet or choose a different ${blockchainDisplayName} address.`}
                    icon={
                      <LogoContainer>
                        <WalletImageContainer>
                          <Image src={wallet.image} size={45} />
                        </WalletImageContainer>
                        <Spinner />
                      </LogoContainer>
                    }
                  />
                ) : (
                  <MessageBox
                    type="success"
                    title={`${blockchainDisplayName} Chain Added`}
                    description={`${blockchainDisplayName} is added to your wallet, you can use it to swap.`}
                  />
                )}
                <Divider direction="vertical" size={32} />
                <BottomLogo />
              </Modal>
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
            Show more wallets
            <Typography variant="label" size="medium" color="$primary">
              &nbsp;+{numberOfSupportedWallets - (limit ?? 0)}
            </Typography>
          </Typography>
        </WalletButton>
      )}
    </>
  );
}
