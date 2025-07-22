import type { PropTypes } from './ImportCustomToken.types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox } from '@arlert-dev/ui';
import React, { useEffect, useState } from 'react';

import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { CustomTokenModal } from '../CustomTokenModal';

export function ImportCustomToken(props: PropTypes) {
  const {
    token,
    blockchain,
    error,
    address,
    fetchCustomToken,
    onCloseErrorModal,
    onImport,
    onExitErrorModal,
    onExitImportModal,
  } = props;
  const { setCustomToken } = useAppStore();
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [retryClicked, setRetryClicked] = useState(false);

  const getCustomToken = () => {
    if (blockchain) {
      void fetchCustomToken?.({
        blockchain: blockchain.name,
        tokenAddress: address,
      });
    }
  };

  const closeErrorModal = () => {
    if (error?.type !== 'network-error') {
      onCloseErrorModal?.();
    }
    setShowErrorModal(false);
  };

  const handleErrorModalButtonClick = () => {
    setRetryClicked(true);
    closeErrorModal();
  };

  const handleExit = () => {
    if (retryClicked && error?.type === 'network-error') {
      setRetryClicked(false);
      void getCustomToken();
    }
    onExitErrorModal();
  };

  const handleSubmit = () => {
    if (token) {
      setCustomToken(token);
      onImport();
    }
  };

  useEffect(() => {
    if (!!error) {
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (blockchain && token) {
      setShowImportModal(true);
    }
  }, [blockchain, token]);
  return (
    <>
      <WatermarkedModal
        open={showErrorModal}
        dismissible
        id="widget-add-custom-token-modal"
        onClose={closeErrorModal}
        onExit={handleExit}
        container={getContainer()}>
        <MessageBox
          title={error?.title ?? ''}
          type="error"
          description={
            error?.message || i18n.t('Failed Network, Please retry.')
          }>
          <Divider size={40} />
          <Divider size={10} />
          {/* eslint-disable-next-line jsx-id-attribute-enforcement/missing-ids */}
          <Button
            id={`widget-add-custom-token-${
              error?.type === 'network-error' ? 'retry' : 'add-another'
            }-btn`}
            variant="contained"
            size="large"
            type="primary"
            fullWidth
            onClick={handleErrorModalButtonClick}>
            {error?.type === 'network-error'
              ? i18n.t('Retry')
              : i18n.t('Add another custom token')}
          </Button>
        </MessageBox>
      </WatermarkedModal>
      {blockchain && token && (
        <CustomTokenModal
          blockchain={blockchain}
          token={token}
          onSubmitClick={handleSubmit}
          onClose={() => setShowImportModal(false)}
          open={showImportModal}
          onExit={onExitImportModal}
        />
      )}
    </>
  );
}
