import type { PropTypes } from './MoreWalletsToSelect.types';

import { i18n } from '@lingui/core';
import { Typography } from '@rango-dev/ui';
import React from 'react';

import { WalletList } from '../ConfirmWalletsModal/WalletList';
import { Layout } from '../Layout';

import {
  Container,
  Description,
  ListContainer,
} from './MoreWalletsToSelect.styles';

export function MoreWalletsToSelect(props: PropTypes) {
  const { blockchain, isSelected, selectWallet, onClickBack } = props;
  return (
    <Layout
      header={{
        title: i18n.t('Connect {blockchain} wallet', {
          blockchain,
        }),
        onBack: (event) => {
          if (onClickBack) {
            event.preventDefault();
            onClickBack();
          }
        },
      }}>
      <Container>
        <Description>
          <Typography variant="body" size="small" color="neutral700">
            {i18n.t('You need to connect {blockchain} wallet.', {
              blockchain,
            })}
          </Typography>
        </Description>
        <ListContainer>
          <WalletList
            chain={blockchain}
            isSelected={isSelected}
            onShowMore={() => {
              //
            }}
            selectWallet={selectWallet}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
