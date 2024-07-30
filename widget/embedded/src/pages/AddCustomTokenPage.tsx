import { i18n } from '@lingui/core';
import {
  Alert,
  Button,
  darkTheme,
  Divider,
  DoneIcon,
  MessageBox,
  styled,
  TextField,
  Typography,
} from '@rango-dev/ui';
import { type Token } from 'rango-sdk';
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
import { isValidTokenAddress } from '../utils/meta';

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
    setCustomToken,
  } = useAppStore();
  const [address, setAddress] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);
  const [isOpenImportModal, setIsOpenImportModal] = useState<boolean>(false);
  const [token, setToken] = useState<Token>();
  const { fetchCustomToken, loading, error } = useFetchCustomToken();

  const isValidAddress =
    !!selectedBlockchainForCustomToken &&
    isValidTokenAddress(selectedBlockchainForCustomToken, address);
  const isImportDisabled =
    !selectedBlockchainForCustomToken || !address || !isValidAddress;

  const getCustomToken = async () => {
    if (selectedBlockchainForCustomToken) {
      const res = await fetchCustomToken({
        blockchain: selectedBlockchainForCustomToken.name,
        tokenAddress: address,
      });
      if (!!res) {
        setToken(res);
        setIsOpenImportModal(true);
      }
    }
  };
  const closeErrorModal = () => {
    if (error?.type === 'TOKEN_ERROR') {
      setSelectedBlockchainForCustomToken(null);
      setAddress('');
    }
    setIsOpenErrorModal(false);
  };

  const handleErrorModalButtonClick = async () => {
    if (error?.type === 'NETWORK_ERROR') {
      await getCustomToken();
    }
    closeErrorModal();
  };

  useEffect(() => {
    if (!!error) {
      setIsOpenErrorModal(true);
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
              suffix={
                !!address &&
                isValidAddress && <DoneIcon color="success" size={12} />
              }
              onChange={(e) => setAddress(e.target.value)}
            />
            {!isValidAddress && !!address && (
              <>
                <Divider size={4} />
                <Alert type="error" variant="alarm" title="Invalid Address" />
              </>
            )}
          </div>
          <Divider size={20} />

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
          open={isOpenErrorModal}
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
            token={token}
            handleSubmitClick={() => {
              if (token) {
                setCustomToken(token);
                setIsOpenImportModal(false);
                navigateBack();
              }
            }}
            onClose={() => setIsOpenImportModal(false)}
            open={isOpenImportModal}
          />
        )}
      </PageContainer>
    </Layout>
  );
}
