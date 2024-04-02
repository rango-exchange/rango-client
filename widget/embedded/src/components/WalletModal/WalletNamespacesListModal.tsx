import type { Namespaces } from '@rango-dev/wallets-core';

import { i18n } from '@lingui/core';
import {
  Button,
  Checkbox,
  Image,
  ListItemButton,
  MessageBox,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { LogoContainer, Spinner } from './WalletModalContent.styles';
import {
  NamespaceList,
  WalletImageContainer,
} from './WalletNamespacesListModal.styles';

interface PropTypes {
  open: boolean;
  onClose: () => void;
  onConfirm: (namespaces: Namespaces[]) => void;
  namespaces: Namespaces[];
}

export function WalletNamespacesListModal(props: PropTypes) {
  const [selectedNamespaces, setSelectedNamespaces] = useState<Namespaces[]>(
    []
  );
  const selectedWalletImage = 'todo';

  const onSelect = (value: Namespaces) =>
    setSelectedNamespaces((selectedNamespace) =>
      selectedNamespace.includes(value)
        ? selectedNamespace.filter((namespace) => namespace !== value)
        : selectedNamespace.concat(value)
    );

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
              <Image src={selectedWalletImage} size={45} />
            </WalletImageContainer>
            <Spinner />
          </LogoContainer>
        }
      />
      <NamespaceList>
        {props.namespaces.map((namespace) => (
          <ListItemButton
            key={namespace}
            id={namespace}
            title={namespace}
            hasDivider
            style={{ height: 60 }}
            onClick={() => onSelect(namespace)}
            end={<Checkbox checked={selectedNamespaces.includes(namespace)} />}
          />
        ))}
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
