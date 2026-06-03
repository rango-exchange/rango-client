import type { PropTypes } from './WalletList.type';
import type { ExtendedModalWalletInfo } from '../../utils/wallets';

import { i18n } from '@lingui/core';
import { warn } from '@rango-dev/logging-core';
import {
  makeInfo,
  SelectableWallet,
  Typography,
  WalletState,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { useWalletList } from '../../hooks/useWalletList';
import { useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
import { getAddress, getConciseAddress } from '../../utils/wallets';
import { StatefulConnectModal } from '../StatefulConnectModal';

import { ShowMoreWallets } from './ConfirmWallets.styles';

const ACCOUNT_ADDRESS_MAX_CHARACTERS = 7;

export function WalletList(props: PropTypes) {
  const { chain, quoteChains, isSelected, selectWallet, limit, onShowMore } =
    props;
  const isActiveTab = useUiStore.use.isActiveTab();

  const { connectedWallets } = useAppStore();
  const [selectedWalletToConnect, setSelectedWalletToConnect] =
    useState<ExtendedModalWalletInfo>();
  const { list } = useWalletList({
    chain,
  });

  const [sortedList, setSortedList] = useState<ExtendedModalWalletInfo[]>(list);
  const numberOfSupportedWallets = list.length;
  const shouldShowMoreWallets = limit && numberOfSupportedWallets - limit > 0;

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

  return (
    <>
      {sortedList.slice(0, limit).map((wallet) => {
        const address = getAddress({
          connectedWallets,
          walletType: wallet.type,
          chain,
        });
        const isConnected =
          wallet.state === WalletState.CONNECTED ||
          wallet.state === WalletState.PARTIALLY_CONNECTED;
        const conciseAddress = address
          ? getConciseAddress(address, ACCOUNT_ADDRESS_MAX_CHARACTERS)
          : '';
        const isConnectedButDifferentThanTargetNamespace =
          isConnected && !!wallet.needsNamespace && !conciseAddress;

        const onSelectableWalletClick = async () => {
          const isDisconnected = wallet.state === WalletState.DISCONNECTED;

          if (isDisconnected || isConnectedButDifferentThanTargetNamespace) {
            setSelectedWalletToConnect(wallet);
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
          if (isConnectedButDifferentThanTargetNamespace) {
            return i18n.t('Chain not connected');
          } else if (conciseAddress) {
            return conciseAddress;
          }
          return info.description;
        };

        const getWalletDescriptionColor = () => {
          if (
            wallet.state === WalletState.CONNECTED ||
            wallet.state === WalletState.PARTIALLY_CONNECTED
          ) {
            if (isConnectedButDifferentThanTargetNamespace) {
              return 'neutral600';
            }
            return 'neutral700';
          }

          return info.color;
        };

        return (
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
          id="widget-wallets-list-show-more-wallets-btn"
        >
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
