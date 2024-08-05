import type { PropTypes } from './CustomTokenModal.types';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  ExternalLinkIcon,
  Image,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { Container, StyledLink } from './CustomTokenModal.styles';

export function CustomTokenModal(props: PropTypes) {
  const { open, onClose, token, handleSubmitClick, blockchain } = props;

  return (
    <WatermarkedModal
      open={open}
      dismissible
      onClose={onClose}
      container={getContainer()}>
      <Container>
        <Image src={token?.image} size={45} type="circular" />
        <Typography variant="title" size="medium">
          {token?.name}
        </Typography>
        <Typography variant="body" size="small" className="_blockchain-name">
          {blockchain.displayName}
        </Typography>
        <Divider size={4} />
        <Typography variant="body" size="medium">
          <StyledLink
            href={
              !!blockchain.info && blockchain?.type !== 'COSMOS'
                ? blockchain.info.addressUrl
                    .split('{wallet}')
                    .join(token?.address || '')
                : ''
            }
            target="_blank"
            rel="nofollow noreferrer">
            {token?.address}
            <ExternalLinkIcon size={12} color="gray" />
          </StyledLink>
        </Typography>
        <Divider size={4} />

        <Typography className="_coin-source" variant="body" size="xsmall">
          via{' '}
          <Typography
            className="_coin-source-name"
            variant="body"
            size="xsmall">
            {token?.coinSource}
          </Typography>
        </Typography>
        <Divider size={'32'} />

        <Typography
          size="medium"
          variant="body"
          className="_custom-token-description">
          {i18n.t(
            'This token doesn’t appear on the active token list(s). Make sure this is the token that you want to trade.'
          )}
        </Typography>
      </Container>
      <Divider size={40} />
      <Divider size={10} />

      <Button
        variant="contained"
        size="large"
        type="primary"
        fullWidth
        onClick={handleSubmitClick}>
        {i18n.t('Import')}
      </Button>
    </WatermarkedModal>
  );
}
