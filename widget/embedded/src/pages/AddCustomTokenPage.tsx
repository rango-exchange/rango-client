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
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BlockchainSelectorButton } from '../components/BlockchainSelectorButton';
import { WatermarkedModal } from '../components/common/WatermarkedModal';
import { CustomTokenModal } from '../components/CustomTokenModal';
import { Layout, PageContainer } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { SearchParams } from '../constants/searchParams';
import { useFetchCustomToken } from '../hooks/useFetchCustomToken';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { getContainer } from '../utils/common';
import { findBlockchain, isValidTokenAddress } from '../utils/meta';

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
const CUSTOM_TOKEN_REFRESH_DELAY = 1000;

export function AddCustomTokenPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const navigateBack = useNavigateBack();
  const { setCustomToken } = useAppStore();
  const blockchains = useAppStore().blockchains();

  const blockchainName = searchParams.get(SearchParams.BLOCKCHAIN) || '';
  const blockchain = findBlockchain(blockchainName, blockchains);
  const [address, setAddress] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);
  const [token, setToken] = useState<Token>();
  const { fetchCustomToken, loading, error } = useFetchCustomToken();
  const [networkError, setNetworkError] = useState('');
  const isValidAddress =
    !!blockchain && isValidTokenAddress(blockchain, address);
  const isImportDisabled = !blockchain || !address || !isValidAddress;

  const getCustomToken = async () => {
    if (blockchain) {
      try {
        const res = await fetchCustomToken({
          blockchain: blockchainName,
          tokenAddress: address,
        });
        setNetworkError('');
        if (!!res) {
          setToken(res);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message === 'Failed to fetch') {
          setNetworkError(i18n.t('Network Error'));
          setIsOpenErrorModal(true);
        }
      }
    }
  };

  const closeErrorModal = () => {
    if (!!error) {
      setAddress('');
    }
    setIsOpenErrorModal(false);
  };

  const handleErrorModalButtonClick = async () => {
    if (!!networkError) {
      setTimeout(async () => {
        await getCustomToken();
      }, CUSTOM_TOKEN_REFRESH_DELAY);
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
            <BlockchainSelectorButton
              onClick={() =>
                navigate(navigationRoutes.blockchains, { replace: true })
              }
              hasLogo={!!blockchain?.logo}
              value={
                !!blockchain
                  ? {
                      name: blockchain.displayName,
                      logo: blockchain.logo,
                    }
                  : undefined
              }
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
              disabled={!blockchain}
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

          <Button
            id="widget-add-custom-token-import-btn"
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
            title={error?.title || networkError}
            type="error"
            description={
              error?.message || i18n.t('Failed Network, Please retry.')
            }>
            <Divider size={40} />
            <Divider size={10} />
            {/* eslint-disable-next-line jsx-id-attribute-enforcement/missing-ids */}
            <Button
              id={`widget-add-custom-token-${
                networkError ? 'retry' : 'add-another'
              }-btn`}
              variant="contained"
              size="large"
              type="primary"
              fullWidth
              onClick={handleErrorModalButtonClick}>
              {networkError
                ? i18n.t('Retry')
                : i18n.t('Add another custom token')}
            </Button>
          </MessageBox>
        </WatermarkedModal>
        {blockchain && token && (
          <CustomTokenModal
            blockchain={blockchain}
            token={token}
            onSubmitClick={() => {
              if (token) {
                setCustomToken(token);
                setToken(undefined);
                navigateBack();
              }
            }}
            onClose={() => setToken(undefined)}
            open={!!blockchain && !!token}
          />
        )}
      </PageContainer>
    </Layout>
  );
}
