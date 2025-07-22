import type { PropTypes } from './CustomTokenModal.types';

import { i18n } from '@lingui/core';
import { Divider, ExternalLinkIcon, Image, Typography } from '@arlert-dev/ui';
import React from 'react';

import { DEFAULT_TOKEN_IMAGE_SRC } from '../../constants/customTokens';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { CUSTOM_TOKEN_LEARN_MORE_LINK } from './CustomTokenModal.constants';
import { generateExplorerLink } from './CustomTokenModal.helpers';
import { Container, StyledButton, StyledLink } from './CustomTokenModal.styles';

export function CustomTokenModal(props: PropTypes) {
  const { open, onClose, token, onExit, onSubmitClick, blockchain } = props;

  const explorerLink = generateExplorerLink(token.address, blockchain);

  const onClickLearnMore = () =>
    window.open(CUSTOM_TOKEN_LEARN_MORE_LINK, '_blank');

  return (
    <WatermarkedModal
      open={open}
      id="widget-custom-token-watermarked-modal"
      dismissible
      onClose={onClose}
      onExit={onExit}
      container={getContainer()}>
      <Container>
        <Image
          src={token.image === '' ? DEFAULT_TOKEN_IMAGE_SRC : token.image}
          size={45}
          type="circular"
        />
        <Divider size={4} />
        <Typography variant="title" size="medium">
          {token.symbol}
        </Typography>
        <Typography variant="body" size="small" className="_blockchain-name">
          {blockchain.displayName}
        </Typography>
        <Divider size={4} />

        <Typography variant="body" size="medium">
          {!!explorerLink ? (
            <StyledLink
              hasHover
              href={explorerLink}
              target="_blank"
              rel="nofollow noreferrer">
              {token.address}
              <ExternalLinkIcon size={12} color="gray" />
            </StyledLink>
          ) : (
            <StyledLink>{token.address}</StyledLink>
          )}
        </Typography>

        <Divider size={4} />

        {token.coinSource && (
          <Typography className="_coin-source" variant="body" size="xsmall">
            {i18n.t('via')}{' '}
            <Typography
              className="_coin-source-name"
              variant="body"
              size="xsmall">
              {token.coinSource}
            </Typography>
          </Typography>
        )}
        <Divider size={'32'} />

        <Typography
          size="medium"
          variant="body"
          className="_custom-token-description">
          {i18n.t(
            `This token is not part of our verified token list. please verify its source and make sure to understand all associated risks before proceeding.`
          )}
        </Typography>
      </Container>
      <Divider size={40} />
      <Divider size={10} />

      <StyledButton
        id="widget-custom-token-modal-import-btn"
        variant="contained"
        size="large"
        type="primary"
        fullWidth
        onClick={onSubmitClick}>
        {i18n.t('Import Anyway')}
      </StyledButton>
      <Divider size={10} />
      <StyledButton
        id="widget-custom-token-modal-learn-more-btn"
        variant="outlined"
        size="large"
        type="primary"
        fullWidth
        onClick={onClickLearnMore}>
        {i18n.t('Learn More')}
      </StyledButton>
    </WatermarkedModal>
  );
}
