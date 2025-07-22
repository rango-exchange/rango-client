import type { Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Button,
  CustomTokensZeroStateDarkIcon,
  CustomTokensZeroStateIcon,
  DeleteIcon,
  Divider,
  IconButton,
  MessageBox,
  NotFound,
  styled,
} from '@arlert-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WatermarkedModal } from '../components/common/WatermarkedModal';
import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { TokenList } from '../components/TokenList';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { containsText, getContainer } from '../utils/common';
import { createTokenHash } from '../utils/meta';

const Content = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  flex: 1,
});
const NotFoundContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0.75',
});
const DeleteIconButton = styled(IconButton, {
  '&:hover': {
    '& svg': {
      color: '$secondary550',
    },
  },
});
export function CustomTokensPage() {
  const [searchedFor, setSearchedFor] = useState<string>('');
  const { deleteCustomToken } = useAppStore();
  const customTokens = useAppStore().customTokens();
  const { fromToken, toToken, setFromToken, setToToken } = useQuoteStore();
  const { mode } = useTheme({});
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token>();
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchedFor(value);
  };
  const isDarkTheme = mode === 'dark';

  const customTokensResults = customTokens.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor)
  );

  const handleDeleteCustomToken = () => {
    if (selectedToken) {
      const toTokenHash = toToken ? createTokenHash(toToken) : null;
      const fromTokenHash = fromToken ? createTokenHash(fromToken) : null;
      const selectedTokenHash = createTokenHash(selectedToken);

      if (toTokenHash === selectedTokenHash) {
        setToToken({ token: null });
      } else if (fromTokenHash === selectedTokenHash) {
        setFromToken({ token: null });
      }
      deleteCustomToken(selectedToken);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <Layout
      header={{
        title: i18n.t('Custom Tokens'),
      }}>
      <PageContainer>
        <Content>
          {!!customTokens.length ? (
            <>
              <SearchInput
                id="widget-custom-tokens-search-token-input"
                value={searchedFor}
                setValue={setSearchedFor}
                fullWidth
                color="light"
                variant="contained"
                placeholder={i18n.t('Search Token')}
                onChange={handleSearch}
              />
              <Divider size={16} />
              <TokenList
                list={customTokensResults}
                type="custom-token"
                searchedFor={searchedFor}
                showTitle={false}
                showWarning={false}
                action={(token) => (
                  <DeleteIconButton
                    id="widget-custom-token-delete-icon-btn"
                    variant="ghost"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedToken(token);
                    }}>
                    <DeleteIcon size={12} color="gray" />
                  </DeleteIconButton>
                )}
              />
            </>
          ) : (
            <NotFoundContent>
              <NotFound
                icon={
                  isDarkTheme ? (
                    <CustomTokensZeroStateDarkIcon size={200} />
                  ) : (
                    <CustomTokensZeroStateIcon size={200} />
                  )
                }
                title={i18n.t('No custom tokens')}
                description={i18n.t(
                  'press the button to add your custom token'
                )}
              />
            </NotFoundContent>
          )}
          <Divider size={20} />

          <Button
            id="widget-custom-token-add-btn"
            type="primary"
            variant="contained"
            size="large"
            onClick={() => navigate(navigationRoutes.addCustomTokens)}>
            {i18n.t('Add Custom Token')}
          </Button>
        </Content>
        <WatermarkedModal
          open={isDeleteModalOpen}
          id="widget-custom-tokens-delete-modal"
          dismissible
          onClose={() => setIsDeleteModalOpen(false)}
          container={getContainer()}>
          <MessageBox
            title={i18n.t('Delete Custom Token')}
            type="error"
            description={i18n.t('Are you sure you want to Delete this Token?')}>
            <Divider size={40} />
            <Divider size={10} />

            <Button
              fullWidth
              id="widget-custom-token-delete-modal-yes-btn"
              variant="contained"
              type="primary"
              size="large"
              onClick={handleDeleteCustomToken}>
              {i18n.t('Yes, Delete it')}
            </Button>
            <Divider size={12} />
            <Button
              id="widget-custom-token-delete-modal-no-btn"
              fullWidth
              variant="outlined"
              type="primary"
              size="large"
              onClick={() => setIsDeleteModalOpen(false)}>
              {i18n.t('No, Continue')}
            </Button>
          </MessageBox>
        </WatermarkedModal>
      </PageContainer>
    </Layout>
  );
}
