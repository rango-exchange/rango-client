import type { Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Button,
  CustomTokensIcon,
  DeleteIcon,
  Divider,
  IconButton,
  MessageBox,
  NotFound,
  styled,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WatermarkedModal } from '../components/common/WatermarkedModal';
import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { TokenList } from '../components/TokenList';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useAppStore } from '../store/AppStore';
import { getContainer } from '../utils/common';

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
  const { customTokens, deleteCustomToken } = useAppStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token>();
  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchedFor(value);
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
                value={searchedFor}
                setValue={setSearchedFor}
                fullWidth
                color="light"
                variant="contained"
                placeholder={i18n.t('Search Token')}
                onChange={searchHandler}
              />
              <Divider size={16} />
              <TokenList
                list={customTokens}
                searchedFor={searchedFor}
                endTokensItem={(token) => (
                  <DeleteIconButton
                    variant="ghost"
                    onClick={() => {
                      setOpen(true);
                      setSelectedToken(token);
                    }}>
                    <DeleteIcon size={12} color="gray" />
                  </DeleteIconButton>
                )}
              />
            </>
          ) : (
            <NotFoundContent>
              <CustomTokensIcon size={200} />
              <NotFound
                hasIcon={false}
                title={i18n.t('No custom tokens')}
                description={i18n.t(
                  'press the button to add your custom token'
                )}
              />
            </NotFoundContent>
          )}

          <Button
            type="primary"
            variant="contained"
            size="large"
            onClick={() => navigate(navigationRoutes.addCustomTokens)}>
            {i18n.t('Add Custom Token')}
          </Button>
        </Content>
        <WatermarkedModal
          open={open}
          dismissible
          onClose={() => setOpen(false)}
          container={getContainer()}>
          <MessageBox
            title={i18n.t('Delete Custom Token')}
            type="error"
            description={i18n.t('Are you sure you want to Delete this Token?')}>
            <Divider size={40} />
            <Divider size={10} />

            <Button
              fullWidth
              variant="contained"
              type="primary"
              size="large"
              onClick={() => {
                selectedToken && deleteCustomToken(selectedToken);
                setOpen(false);
              }}>
              {i18n.t('Yes, Delete it')}
            </Button>
            <Divider size={12} />
            <Button
              fullWidth
              variant="outlined"
              type="primary"
              size="large"
              onClick={() => setOpen(false)}>
              {i18n.t('No, Continue')}
            </Button>
          </MessageBox>
        </WatermarkedModal>
      </PageContainer>
    </Layout>
  );
}
