import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox } from '@rango-dev/ui';
import React from 'react';

interface PropTypes {
  displayName?: string;
  onConfirm: () => void;
}

export function ExperimentalChain(props: PropTypes) {
  const { displayName, onConfirm } = props;

  return (
    <MessageBox
      title={i18n.t({
        id: 'Add {blockchainDisplayName} Chain',
        values: { blockchainDisplayName: displayName },
      })}
      type="warning"
      description={i18n.t({
        id: 'Would you like to add the {blockchainDisplayName} experimental chain to your wallet?',
        values: { blockchainDisplayName: displayName },
      })}>
      <Divider size={18} />
      <Divider size={32} />
      <Button
        id="widget-experimental-chain-confirm-btn"
        onClick={onConfirm}
        variant="outlined"
        type="primary"
        fullWidth
        size="large">
        {i18n.t('Confirm')}
      </Button>
    </MessageBox>
  );
}
