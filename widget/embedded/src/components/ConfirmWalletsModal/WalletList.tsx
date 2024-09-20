import type { PropTypes } from './WalletList.type';
import type { Wallet } from '../../types';
import type { ExtendedModalWalletInfo } from '../../utils/wallets';

import { i18n } from '@lingui/core';
import { warn } from '@rango-dev/logging-core';
import {
  Divider,
  SelectableWallet,
  Typography,
  WalletState,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { useWallets } from '../..';
import { WIDGET_UI_ID } from '../../constants';
import {
  ResultStatus,
  useStatefulConnect,
} from '../../hooks/useStatefulConnect';
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
  const { chain, isSelected, selectWallet, limit, onShowMore } = props;
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
  const { handleDisconnect } = useStatefulConnect();
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
    } catch (e) {
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
        const conciseAddress = address
          ? getConciseAddress(address, ACCOUNT_ADDRESS_MAX_CHARACTERS)
          : '';

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

        const connectedWalletDescription = couldAddExperimentalChain
          ? i18n.t({
              id: 'Add {chain} chain',
              values: { chain },
            })
          : conciseAddress;

        const onSelectableWalletClick = async () => {
          const isDisconnected = wallet.state === WalletState.DISCONNECTED;
          const isConnectedButDifferentThanTargetNamespace = wallet.isHub
            ? !conciseAddress
            : !!wallet.namespaces && !conciseAddress;

          if (isDisconnected) {
            setSelectedWalletToConnect(wallet);
          } else if (isConnectedButDifferentThanTargetNamespace) {
            // wallet is connected on a different namespace
            await handleDisconnect(wallet.type);

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
                open={!!experimentalChainWallet && showExperimentalChainModal}
                container={modalContainer}
                onClose={() => {
                  setExperimentalChainWallet(null);
                }}>
                <ExperimentalChain
                  displayName={blockchainDisplayName}
                  onConfirm={() => {
                    void addExperimentalChain(experimentalChainWallet);
                  }}
                />
              </WatermarkedModal>
            )}
            {addingExperimentalChainStatus && (
              <WatermarkedModal
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
              description={connectedWalletDescription}
              onClick={onSelectableWalletClick}
              selected={isSelected(wallet.type, chain)}
              disabled={!isActiveTab}
              {...wallet}
            />
          </React.Fragment>
        );
      })}
      <StatefulConnectModal
        wallet={selectedWalletToConnect}
        onClose={() => {
          setSelectedWalletToConnect(undefined);
        }}
        onConnect={(result) => {
          if (props.onConnect && result.status === ResultStatus.Connected) {
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
        <ShowMoreWallets selected={false} onClick={onShowMore}>
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
