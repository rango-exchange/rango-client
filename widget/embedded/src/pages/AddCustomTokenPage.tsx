import { i18n } from '@lingui/core';
import {
  Alert,
  Button,
  darkTheme,
  Divider,
  MessageBox,
  styled,
  TextField,
  Typography,
} from '@rango-dev/ui';
import { type Token, TransactionType } from 'rango-sdk';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WatermarkedModal } from '../components/common/WatermarkedModal';
import { CustomTokenModal } from '../components/CustomTokenModal';
import { ItemPicker } from '../components/ItemPicker';
import { Layout, PageContainer } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useFetchCustomToken } from '../hooks/useFetchCustomToken';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { getContainer } from '../utils/common';
import { isValidEvmAddress, isValidSolanaAddress } from '../utils/meta';

const Content = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  flex: 1,
  '& ._text-field': {
    padding: '$4 $10',
    backgroundColor: '$neutral300',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral400',
    },
    borderRadius: '$sm',
    height: '$40',
  },
});

export function AddCustomTokenPage() {
  const navigate = useNavigate();
  const navigateBack = useNavigateBack();

  const {
    selectedBlockchainForCustomToken,
    setSelectedBlockchainForCustomToken,
    setCustomTokens,
  } = useAppStore();
  const [address, setAddress] = useState('');
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const [openImportModal, setOpenImportModal] = useState<boolean>(false);
  const [customToken, setCustomToken] = useState<Token>();
  const { fetchCustomToken, loading, error } = useFetchCustomToken();

  const isValidAddress =
    !!selectedBlockchainForCustomToken &&
    ((selectedBlockchainForCustomToken.type === TransactionType.SOLANA &&
      isValidSolanaAddress(address)) ||
      (selectedBlockchainForCustomToken.type === TransactionType.EVM &&
        isValidEvmAddress(address)));
  const isImportDisabled =
    !selectedBlockchainForCustomToken || !address || !isValidAddress;

  const getCustomToken = async () => {
    if (selectedBlockchainForCustomToken) {
      const res = await fetchCustomToken({
        blockchain: selectedBlockchainForCustomToken.name,
        tokenAddress: address,
      });
      if (!!res) {
        setCustomToken(res);
        setOpenImportModal(true);
      }
    }
  };
  const closeErrorModal = () => {
    if (error?.type === 'TOKEN_ERROR') {
      setSelectedBlockchainForCustomToken(null);
      setAddress('');
    }
    setOpenErrorModal(false);
  };

  const handleErrorModalButtonClick = async () => {
    if (error?.type === 'NETWORK_ERROR') {
      await getCustomToken();
    }
    closeErrorModal();
  };

  useEffect(() => {
    if (!!error) {
      setOpenErrorModal(true);
    }
  }, [error]);
  return (
    <Layout
      header={{
        title: i18n.t('Add Custom Token'),
      }}>
      <PageContainer>
        <Content>
          <div>
            <ItemPicker
              onClick={() => navigate(navigationRoutes.blockchains)}
              hasLogo={!!selectedBlockchainForCustomToken?.logo}
              value={{
                label: selectedBlockchainForCustomToken?.displayName,
                logo: selectedBlockchainForCustomToken?.logo,
              }}
              title={i18n.t('Select chain')}
              placeholder={i18n.t('Select chain')}
            />
            <Divider size={'24'} />
            <Typography size="large" variant="label">
              {i18n.t('Enter Address')}
            </Typography>
            <Divider size={10} />
            <TextField
              fullWidth
              variant="contained"
              placeholder={i18n.t('Enter token address')}
              size="large"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {!isValidAddress && !!address && (
              <>
                <Divider size={4} />
                <Alert type="error" variant="alarm" title="Invalid Address" />
              </>
            )}
          </div>

          <Button
            disabled={isImportDisabled}
            type="primary"
            variant="contained"
            loading={loading}
            size="large"
            onClick={getCustomToken}>
            {i18n.t('Import')}
          </Button>
        </Content>
        <WatermarkedModal
          open={openErrorModal}
          dismissible
          onClose={closeErrorModal}
          container={getContainer()}>
          <MessageBox
            title={error?.title || ''}
            type="error"
            description={error?.message}>
            <Divider size={40} />
            <Divider size={10} />

            <Button
              variant="contained"
              size="large"
              type="primary"
              fullWidth
              onClick={handleErrorModalButtonClick}>
              {error?.type === 'NETWORK_ERROR'
                ? i18n.t('Retry')
                : i18n.t('Add another custom token')}
            </Button>
          </MessageBox>
        </WatermarkedModal>
        {!!selectedBlockchainForCustomToken && (
          <CustomTokenModal
            blockchain={selectedBlockchainForCustomToken}
            token={customToken}
            handleSubmitClick={() => {
              if (customToken) {
                setCustomTokens(customToken);
                navigateBack();
              }
            }}
            onClose={() => setOpenImportModal(false)}
            open={openImportModal}
          />
        )}
      </PageContainer>
    </Layout>
  );
}
