import { i18n } from '@lingui/core';
import {
  Alert,
  Button,
  darkTheme,
  Divider,
  DoneIcon,
  styled,
  TextField,
  Typography,
} from '@arlert-dev/ui';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BlockchainSelectorButton } from '../components/BlockchainSelectorButton';
import { ImportCustomToken } from '../components/ImportCustomToken';
import { Layout, PageContainer } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { SearchParams } from '../constants/searchParams';
import { useFetchCustomToken } from '../hooks/useFetchCustomToken';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
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

export function AddCustomTokenPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const navigateBack = useNavigateBack();
  const blockchains = useAppStore().blockchains();

  const blockchainName = searchParams.get(SearchParams.BLOCKCHAIN) || '';
  const blockchain = findBlockchain(blockchainName, blockchains);
  const [address, setAddress] = useState('');
  const { fetchCustomToken, token, loading, error, resetState } =
    useFetchCustomToken();
  const isValidAddress =
    !!blockchain && isValidTokenAddress(blockchain, address);
  const isImportDisabled = !blockchain || !address || !isValidAddress;

  const getCustomToken = () => {
    if (blockchain) {
      void fetchCustomToken({
        blockchain: blockchainName,
        tokenAddress: address,
      });
    }
  };

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
              id="widget-add-custom-token-token-address-input"
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
                <Alert
                  id="widget-add-custom-token-invalid-address-alert"
                  type="error"
                  variant="alarm"
                  title="Invalid Address"
                />
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
        <ImportCustomToken
          token={token}
          blockchain={blockchain ?? undefined}
          address={address}
          error={error ?? undefined}
          fetchCustomToken={fetchCustomToken}
          onCloseErrorModal={() => {
            if (error?.type !== 'network-error') {
              setAddress('');
            }
          }}
          onImport={navigateBack}
          onExitErrorModal={resetState}
          onExitImportModal={resetState}
        />
      </PageContainer>
    </Layout>
  );
}
