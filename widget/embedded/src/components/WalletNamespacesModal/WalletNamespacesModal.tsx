import type { PropTypes } from './WalletNamespacesModal.types';
import type { BlockchainMeta } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Button,
  Checkbox,
  Image,
  ListItemButton,
  MessageBox,
  Radio,
  RadioRoot,
} from '@rango-dev/ui';
import { Namespace } from '@rango-dev/wallets-shared';
import React, { useMemo, useState } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { useAppStore } from '../../store/AppStore';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { WalletImageContainer } from '../HeaderButtons/HeaderButtons.styles';
import {
  LogoContainer,
  Spinner,
} from '../WalletModal/WalletModalContent.styles';

import { NamespaceList } from './WalletNamespacesModal.styles';

export const namespaceMainBlockchain: Record<Namespace, string> = {
  [Namespace.Evm]: 'ETH',
  [Namespace.Solana]: 'SOLANA',
  [Namespace.Cosmos]: 'COSMOS',
  [Namespace.Utxo]: 'BTC',
  [Namespace.Starknet]: 'STARKNET',
  [Namespace.Tron]: 'TRON',
};

const getBlockchainLogo = (
  blockchains: BlockchainMeta[],
  blockchainName: string
) => {
  return blockchains.find((blockchain) => blockchain.name === blockchainName)
    ?.logo;
};

export function WalletNamespacesModal(props: PropTypes) {
  const { singleNamespace, namespaces } = props;

  const [selectedNamespaces, setSelectedNamespaces] = useState<Namespace[]>([]);

  const blockchains = useAppStore().blockchains();

  const namespacesInfo = useMemo(
    () =>
      namespaces?.map((namespace) => ({
        name: namespace,
        logo: getBlockchainLogo(
          blockchains,
          namespaceMainBlockchain[namespace]
        ),
      })),
    [namespaces]
  );

  const onSelect = (namespace: Namespace) => {
    if (singleNamespace) {
      setSelectedNamespaces([namespace]);
    } else {
      setSelectedNamespaces((selectedNamespaces) =>
        selectedNamespaces.includes(namespace)
          ? selectedNamespaces.filter((item) => item !== namespace)
          : selectedNamespaces.concat(namespace)
      );
    }
  };

  const wrapRadioRoot = (children: React.ReactNode) => {
    if (singleNamespace) {
      return <RadioRoot value={selectedNamespaces?.[0]}>{children}</RadioRoot>;
    }

    return <>{children}</>;
  };

  return (
    <WatermarkedModal
      open={props.open}
      onClose={props.onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      <MessageBox
        type="info"
        title={i18n.t('Select chain types')}
        description={i18n.t(
          `This wallet supports multiple chains. Select which chain you'd like to connect to.`
        )}
        icon={
          <LogoContainer>
            <WalletImageContainer>
              <Image src={props.image} size={45} />
            </WalletImageContainer>
            <Spinner />
          </LogoContainer>
        }
      />
      <NamespaceList>
        {wrapRadioRoot(
          <>
            {namespacesInfo?.map((namespaceInfoItem) => (
              <ListItemButton
                key={namespaceInfoItem.name}
                id={namespaceInfoItem.name}
                title={namespaceInfoItem.name}
                hasDivider
                style={{ height: 60 }}
                onClick={() => onSelect(namespaceInfoItem.name)}
                start={<Image src={namespaceInfoItem.logo} size={22} />}
                end={
                  singleNamespace ? (
                    <Radio value={namespaceInfoItem.name} />
                  ) : (
                    <Checkbox
                      checked={selectedNamespaces.includes(
                        namespaceInfoItem.name
                      )}
                    />
                  )
                }
              />
            ))}
          </>
        )}
      </NamespaceList>
      <Button
        type="primary"
        disabled={!selectedNamespaces.length}
        onClick={() => props.onConfirm(selectedNamespaces)}>
        {i18n.t('Confirm')}
      </Button>
    </WatermarkedModal>
  );
}
