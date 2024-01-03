import type { UnknownPriceWarning } from '../../types';

import { Button, Divider, MessageBox, Modal, WarningIcon } from '@yeager-dev/ui';
import React from 'react';

import { errorMessages } from '../../constants/errors';
import { getContainer } from '../../utils/common';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warning: UnknownPriceWarning;
};

export function UnknownPriceWarningModal(props: Props) {
  const { open, onClose, onConfirm } = props;

  return (
    <Modal open={open} onClose={onClose} container={getContainer()}>
      <MessageBox
        type="warning"
        title={errorMessages().unknownPriceError.impactTitle}
        description={errorMessages().unknownPriceError.description}
      />

      <Divider size={32} />
      <Button
        type="primary"
        size="large"
        prefix={<WarningIcon />}
        fullWidth
        onClick={onConfirm}>
        {errorMessages().unknownPriceError.confirmMessage}
      </Button>
    </Modal>
  );
}
