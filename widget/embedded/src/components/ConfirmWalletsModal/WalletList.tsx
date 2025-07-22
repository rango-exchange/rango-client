import type { PropTypes } from './WalletList.type';
import type { Wallet } from '../../types';
import type { ExtendedModalWalletInfo } from '../../utils/wallets';

import { i18n } from '@lingui/core';
import { warn } from '@arlert-dev/logging-core';
import {
  Divider,
  makeInfo,
  SelectableWallet,
  Typography,
  WalletState,
} from '@arlert-dev/ui';
import React, { useEffect, useState } from 'react';

import { useWallets } from '../..';
import { WIDGET_UI_ID } from '../../constants';
import { useWalletList } from '../../hooks/useWalletList';
import { useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
import { getBlockchainDisplayNameFor } from '../../utils/meta';
import {
  getAddress,
  getConciseAddress,
  isExperimentalChain,
} from '../../utils/wallets';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { StatefulConnectModal } from '../StatefulConnectModal';
import { ExperimentalChain } from '../WalletStatefulConnect';
import { ExperimentalChainStatus } from '../WalletStatefulConnect/ExperimentalChainStatus';

import { ShowMoreWallets } from './ConfirmWallets.styles';

const ACCOUNT_ADDRESS_MAX_CHARACTERS = 7;
const TIME_TO_CLOSE_MODAL = 3_000;

export function WalletList(props: PropTypes) {
  const { chain, quoteChains, isSelected, selectWallet, limit, onShowMore } =
    props;
  const isActiveTab = useUiStore.use.isActiveTab();

  const { blockchains, connectedWallets } = useAppStore();
  const [selectedWalletToConnect, setSelectedWalletToConnect] =
    useState<ExtendedModalWalletInfo>();
  const [experimentalChainWallet, setExperimentalChainWallet] =
    useState<Wallet | null>(null);
  const [showExperimentalChainModal, setShowExperimentalChainModal] =
    useState(false);
  const [addingExperimentalChainStatus, setAddingExperimentalChainStatus] =
    useState<'in-progress' | 'completed' | 'rejected' | null>(null);
  const { suggestAndConnect } = useWallets();
  const { list } = useWalletList({
    chain,
  });

  const [sortedList, setSortedList] = useState<ExtendedModalWalletInfo[]>(list);
  const numberOfSupportedWallets = list.length;
  const shouldShowMoreWallets = limit && numberOfSupportedWallets - limit > 0;

  const addExperimentalChain = async (wallet: Wallet) => {
    setShowExperimentalChainModal(false);
    setAddingExperimentalChainStatus('in-progress');
    try {
      await suggestAndConnect(wallet.walletType, wallet.chain);
      setAddingExperimentalChainStatus('completed');
    } catch {
      setAddingExperimentalChainStatus('rejected');
    }
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

  const modalContainer = document.getElementById(
    WIDGET_UI_ID.SWAP_BOX_ID
  ) as HTMLDivElement;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (
      addingExperimentalChainStatus === 'completed' ||
      addingExperimentalChainStatus === 'rejected'
    ) {
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
        const isConnected = wallet.state === WalletState.CONNECTED;
        const conciseAddress = address
          ? getConciseAddress(address, ACCOUNT_ADDRESS_MAX_CHARACTERS)
          : '';
        const isConnectedButDifferentThanTargetNamespace =
          isConnected && !!wallet.needsNamespace && !conciseAddress;

        const experimentalChain = isExperimentalChain(blockchains(), chain);

        const experimentalChainNotAdded = !connectedWallets.find(
          (connectedWallet) =>
            connectedWallet.walletType === wallet.type &&
            connectedWallet.chain === chain
        );

        const couldAddExperimentalChain =
          experimentalChain &&
          experimentalChainNotAdded &&
          wallet.state === WalletState.CONNECTED;

        const onSelectableWalletClick = async () => {
          const isDisconnected = wallet.state === WalletState.DISCONNECTED;

          if (isDisconnected || isConnectedButDifferentThanTargetNamespace) {
            setSelectedWalletToConnect(wallet);
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

        const info = makeInfo(wallet.state);

        const getWalletDescription = () => {
          if (couldAddExperimentalChain) {
            return i18n.t({
              id: 'Add {chain} chain',
              values: { chain },
            });
          } else if (isConnectedButDifferentThanTargetNamespace) {
            return i18n.t('Chain not connected');
          } else if (conciseAddress) {
            return conciseAddress;
          }
          return info.description;
        };

        const getWalletDescriptionColor = () => {
          if (wallet.state === WalletState.CONNECTED) {
            if (isConnectedButDifferentThanTargetNamespace) {
              return 'neutral600';
            }
            return 'neutral700';
          }
          return info.color;
        };

        const blockchainDisplayName: string | undefined =
          experimentalChainWallet?.chain
            ? getBlockchainDisplayNameFor(
                experimentalChainWallet.chain,
                blockchains()
              )
            : undefined;
        return (
          <React.Fragment key={`${wallet.title}_${blockchainDisplayName}`}>
            {!!experimentalChainWallet && (
              <WatermarkedModal
                id="widget-wallets-list-watermarked-modal"
                open={!!experimentalChainWallet && showExperimentalChainModal}
                container={modalContainer}
                onClose={() => {
                  setExperimentalChainWallet(null);
                }}>
                <ExperimentalChain
                  id="widget-wallets-list-experimental-chain-container"
                  displayName={blockchainDisplayName}
                  onConfirm={() => {
                    void addExperimentalChain(experimentalChainWallet);
                  }}
                />
              </WatermarkedModal>
            )}
            {addingExperimentalChainStatus && (
              <WatermarkedModal
                id="widget-wallets-list-experimental-chain-watermarked-modal"
                open={!!addingExperimentalChainStatus}
                onClose={setAddingExperimentalChainStatus.bind(null, null)}
                container={modalContainer}>
                <ExperimentalChainStatus
                  status={addingExperimentalChainStatus}
                  displayName={blockchainDisplayName}
                  image={wallet.image}
                />
                <Divider direction="vertical" size={32} />
              </WatermarkedModal>
            )}
            <SelectableWallet
              key={wallet.type}
              id="widget-wallets-list-selectable-wallet-btn"
              description={getWalletDescription()}
              descriptionColor={getWalletDescriptionColor()}
              onClick={onSelectableWalletClick}
              selected={isSelected(wallet.type, chain)}
              disabled={!isActiveTab}
              {...wallet}
            />
          </React.Fragment>
        );
      })}
      <StatefulConnectModal
        id="widget-wallets-list-stateful-connect-modal"
        wallet={selectedWalletToConnect}
        options={{ defaultSelectedChains: quoteChains || [chain] }}
        onClose={() => {
          setSelectedWalletToConnect(undefined);
        }}
        onConnect={() => {
          if (props.onConnect) {
            if (selectedWalletToConnect?.type) {
              props.onConnect(selectedWalletToConnect.type);
            } else {
              warn(
                new Error(
                  "The selected wallet hasn't been detected after the connection process finished. It usually shouldn't happen."
                )
              );
            }
          }
        }}
      />
      {shouldShowMoreWallets && (
        <ShowMoreWallets
          selected={false}
          onClick={onShowMore}
          id="widget-wallets-list-show-more-wallets-btn">
          <Typography variant="label" size="medium">
            {i18n.t('Show more wallets')}
            <Typography variant="label" size="medium" color="$primary">
              &nbsp;+{numberOfSupportedWallets - (limit ?? 0)}
            </Typography>
          </Typography>
        </ShowMoreWallets>
      )}
    </>
  );
}
