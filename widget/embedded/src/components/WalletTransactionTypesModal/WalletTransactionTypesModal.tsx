import type { TransactionType } from 'rango-sdk';

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
import {
  LogoContainer,
  Spinner,
} from '../WalletModal/WalletModalContent.styles';

import {
  NamespaceList,
  WalletImageContainer,
} from './WalletTransactionTypesModal.styles';

interface PropTypes {
  open: boolean;
  onClose: () => void;
  onConfirm: (transactionTypes: TransactionType[]) => void;
  transactionTypes?: TransactionType[];
}

export function WalletTransactionTypesModal(props: PropTypes) {
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<
    TransactionType[]
  >([]);
  const selectedWalletImage = 'todo';

  const onSelect = (transactionType: TransactionType) =>
    setSelectedTransactionTypes((selectedTransactionTypes) =>
      selectedTransactionTypes.includes(transactionType)
        ? selectedTransactionTypes.filter((item) => item !== transactionType)
        : selectedTransactionTypes.concat(transactionType)
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
        {props.transactionTypes?.map((transactionType) => (
          <ListItemButton
            key={transactionType}
            id={transactionType}
            title={transactionType}
            hasDivider
            style={{ height: 60 }}
            onClick={() => onSelect(transactionType)}
            end={
              <Checkbox
                checked={selectedTransactionTypes.includes(transactionType)}
              />
            }
          />
        ))}
      </NamespaceList>
      <Button
        type="primary"
        disabled={!selectedTransactionTypes.length}
        onClick={() => props.onConfirm(selectedTransactionTypes)}>
        {i18n.t('Confirm')}
      </Button>
    </WatermarkedModal>
  );
}
